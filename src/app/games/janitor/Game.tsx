'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Link from 'next/link'

interface Mess {
  id: number
  x: number
  z: number
  type: 'trash' | 'spill'
  cleaned: boolean
}

const INITIAL_MESSES: Mess[] = [
  { id: 1,  x:  3.5, z:  4.0, type: 'spill', cleaned: false },
  { id: 2,  x: -4.0, z: -3.5, type: 'trash', cleaned: false },
  { id: 3,  x:  6.0, z: -5.0, type: 'spill', cleaned: false },
  { id: 4,  x: -7.0, z:  2.5, type: 'trash', cleaned: false },
  { id: 5,  x:  1.5, z: -7.0, type: 'trash', cleaned: false },
  { id: 6,  x: -2.5, z:  6.5, type: 'spill', cleaned: false },
  { id: 7,  x:  7.0, z:  1.0, type: 'trash', cleaned: false },
  { id: 8,  x: -5.5, z: -7.5, type: 'spill', cleaned: false },
  { id: 9,  x:  4.5, z: -2.5, type: 'trash', cleaned: false },
  { id: 10, x: -1.0, z: -4.5, type: 'spill', cleaned: false },
]

const CLEAN_RANGE   = 2.2
const MOVE_SPEED    = 6
const PLAYER_RADIUS = 0.3

const OBSTACLES: [number, number, number, number][] = [
  [-10.06, -9.94, -10, 10],
  [  9.94, 10.06, -10, 10],
  [-10, 10, -10.06, -9.94],
  [-10, 10,   9.94, 10.06],
  [-2.06, -1.94, 7, 10.06],
  [ 1.94,  2.06, 7, 10.06],
  [-2.06, -0.54, 6.94, 7.06],
  [ 0.54,  2.06, 6.94, 7.06],
  [-7, -5, -6.5, -5.5],
  [ 4,  6, -7.5, -6.5],
  [-8, -6,  4.5,  5.5],
  [ 3,  5,  5.5,  6.5],
  [-1,  1, -5.5, -4.5],
]

function blocked(x: number, z: number): boolean {
  for (const [x0, x1, z0, z1] of OBSTACLES) {
    if (x + PLAYER_RADIUS > x0 && x - PLAYER_RADIUS < x1 &&
        z + PLAYER_RADIUS > z0 && z - PLAYER_RADIUS < z1) return true
  }
  return false
}

// ── Third-person player character + camera ─────────────────────────────────────
function Player({
  messesRef,
  onNearbyChange,
  onClean,
}: {
  messesRef: React.RefObject<Mess[]>
  onNearbyChange: (id: number | null) => void
  onClean: (id: number) => void
}) {
  const { camera } = useThree()
  const groupRef    = useRef<THREE.Group>(null)
  const leftLegRef  = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)
  const mopRef      = useRef<THREE.Group>(null)
  const keys        = useRef<Record<string, boolean>>({})
  const nearbyRef   = useRef<number | null>(null)
  const cleaningRef = useRef(false)
  const cleanT      = useRef(0)
  const walkT       = useRef(0)
  const cb = useRef({ onNearbyChange, onClean })
  cb.current = { onNearbyChange, onClean }

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'KeyE' && nearbyRef.current !== null) {
        cb.current.onClean(nearbyRef.current)
        cleaningRef.current = true
        setTimeout(() => { cleaningRef.current = false }, 600)
      }
    }
    const onUp = (e: KeyboardEvent) => { keys.current[e.code] = false }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  useFrame((_, dt) => {
    const g = groupRef.current
    if (!g) return

    let dx = 0, dz = 0
    if (keys.current['KeyW']) dz -= 1
    if (keys.current['KeyS']) dz += 1
    if (keys.current['KeyA']) dx -= 1
    if (keys.current['KeyD']) dx += 1

    const moving = dx !== 0 || dz !== 0

    if (moving) {
      const len = Math.hypot(dx, dz)
      dx /= len; dz /= len

      // Smoothly rotate character to face movement direction
      const targetQ = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(dx, 0, dz),
      )
      g.quaternion.slerp(targetQ, 0.18)

      const nx = g.position.x + dx * MOVE_SPEED * dt
      const nz = g.position.z + dz * MOVE_SPEED * dt
      if (!blocked(nx, g.position.z)) g.position.x = nx
      if (!blocked(g.position.x, nz)) g.position.z = nz

      walkT.current += dt * 9
    }

    // Leg walk animation
    if (leftLegRef.current && rightLegRef.current) {
      const swing = moving ? Math.sin(walkT.current) * 0.45 : 0
      leftLegRef.current.rotation.x  =  swing
      rightLegRef.current.rotation.x = -swing
    }

    // Mop scrub animation when cleaning
    if (cleaningRef.current) cleanT.current += dt * 14
    else cleanT.current *= 0.72
    if (mopRef.current) {
      mopRef.current.rotation.x =
        Math.sin(cleanT.current) * 0.4 * Math.min(1, cleanT.current / 1.5)
    }

    // Follow camera — stays above and slightly behind the player (south side),
    // clamped so it never exits the south wall.
    const camZ = Math.min(g.position.z + 3.8, 9.2)
    camera.position.lerp(new THREE.Vector3(g.position.x, 6.5, camZ), 0.09)
    camera.lookAt(g.position.x, 0.8, g.position.z)

    // Nearest mess detection
    const { x, z } = g.position
    let nearestId: number | null = null
    let minDist = CLEAN_RANGE
    for (const m of messesRef.current!) {
      if (m.cleaned) continue
      const d = Math.hypot(m.x - x, m.z - z)
      if (d < minDist) { minDist = d; nearestId = m.id }
    }
    if (nearestId !== nearbyRef.current) {
      nearbyRef.current = nearestId
      cb.current.onNearbyChange(nearestId)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 8.8]}>
      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.1, 0.35, 0]}>
        <boxGeometry args={[0.14, 0.7, 0.14]} />
        <meshLambertMaterial color="#2a2a44" />
      </mesh>
      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.1, 0.35, 0]}>
        <boxGeometry args={[0.14, 0.7, 0.14]} />
        <meshLambertMaterial color="#2a2a44" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.52, 0.62, 0.28]} />
        <meshLambertMaterial color="#4a6fa5" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.52, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.26]} />
        <meshLambertMaterial color="#fddcb4" />
      </mesh>
      {/* Cap brim */}
      <mesh position={[0, 1.67, 0.04]}>
        <boxGeometry args={[0.34, 0.06, 0.36]} />
        <meshLambertMaterial color="#222244" />
      </mesh>
      {/* Cap crown */}
      <mesh position={[0, 1.76, -0.04]}>
        <boxGeometry args={[0.3, 0.12, 0.26]} />
        <meshLambertMaterial color="#222244" />
      </mesh>
      {/* Mop group (animated) */}
      <group ref={mopRef} position={[0.32, 0.9, 0.06]}>
        <mesh rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.025, 0.025, 1.3, 8]} />
          <meshLambertMaterial color="#8B6914" />
        </mesh>
        <mesh position={[0.19, -0.49, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.08, 8]} />
          <meshLambertMaterial color="#a09060" />
        </mesh>
        <mesh position={[0.19, -0.57, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 10]} />
          <meshLambertMaterial color="#ddddc8" />
        </mesh>
      </group>
    </group>
  )
}

function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2, 0.07, 1]} />
        <meshLambertMaterial color="#7a5c1a" />
      </mesh>
      {([-0.9, 0.9] as number[]).flatMap(lx =>
        [-0.43, 0.43].map(lz => (
          <mesh key={`${lx}${lz}`} position={[lx, 0.35, lz]} castShadow>
            <boxGeometry args={[0.07, 0.7, 0.07]} />
            <meshLambertMaterial color="#4a3000" />
          </mesh>
        ))
      )}
      <mesh position={[0, 1.1, -0.28]} castShadow>
        <boxGeometry args={[0.9, 0.52, 0.05]} />
        <meshLambertMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 0.82, -0.28]}>
        <boxGeometry args={[0.08, 0.08, 0.3]} />
        <meshLambertMaterial color="#222222" />
      </mesh>
    </group>
  )
}

function JanitorCloset() {
  const w = '#4a4a40'
  return (
    <group>
      <mesh position={[-2, 2, 8.5]}>
        <boxGeometry args={[0.12, 4, 3]} />
        <meshLambertMaterial color={w} />
      </mesh>
      <mesh position={[2, 2, 8.5]}>
        <boxGeometry args={[0.12, 4, 3]} />
        <meshLambertMaterial color={w} />
      </mesh>
      <mesh position={[-1.3, 2, 7]}>
        <boxGeometry args={[1.4, 4, 0.12]} />
        <meshLambertMaterial color={w} />
      </mesh>
      <mesh position={[1.3, 2, 7]}>
        <boxGeometry args={[1.4, 4, 0.12]} />
        <meshLambertMaterial color={w} />
      </mesh>
      <mesh position={[0, 3.2, 7]}>
        <boxGeometry args={[1.2, 1.6, 0.12]} />
        <meshLambertMaterial color={w} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 8.5]}>
        <planeGeometry args={[3.76, 3]} />
        <meshLambertMaterial color="#4a4535" />
      </mesh>
      <mesh position={[-1.4, 0.25, 9.2]}>
        <cylinderGeometry args={[0.22, 0.18, 0.5, 12]} />
        <meshLambertMaterial color="#c8a020" />
      </mesh>
      <mesh position={[-1.4, 1.25, 9.2]} rotation={[0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
        <meshLambertMaterial color="#8B6914" />
      </mesh>
      <mesh position={[-1.4, 0.06, 9.2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 12]} />
        <meshLambertMaterial color="#ddddc8" />
      </mesh>
      {([0.55, 1.15, 1.75] as number[]).map((y, i) => (
        <mesh key={i} position={[1.9, y, 8.6]}>
          <boxGeometry args={[0.08, 0.05, 1.6]} />
          <meshLambertMaterial color="#6a5020" />
        </mesh>
      ))}
      <mesh position={[1.82, 0.85, 7.9]}>
        <cylinderGeometry args={[0.065, 0.065, 0.28, 8]} />
        <meshLambertMaterial color="#1a55cc" />
      </mesh>
      <mesh position={[1.82, 0.85, 8.4]}>
        <boxGeometry args={[0.18, 0.22, 0.12]} />
        <meshLambertMaterial color="#cc3333" />
      </mesh>
      <mesh position={[1.82, 0.85, 8.9]}>
        <cylinderGeometry args={[0.07, 0.07, 0.25, 8]} />
        <meshLambertMaterial color="#228833" />
      </mesh>
      <mesh position={[1.82, 1.45, 8.2]}>
        <boxGeometry args={[0.25, 0.2, 0.35]} />
        <meshLambertMaterial color="#dddddd" />
      </mesh>
      <mesh position={[1.82, 1.45, 8.8]}>
        <boxGeometry args={[0.2, 0.18, 0.28]} />
        <meshLambertMaterial color="#eecc44" />
      </mesh>
      <pointLight position={[0, 3.6, 8.5]} intensity={5} color="#fff8e0" distance={5} />
    </group>
  )
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#3d3d2e" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#282828" />
      </mesh>
      {([
        { pos: [0, 2, -10] as [number,number,number], size: [20, 4, 0.12] as [number,number,number] },
        { pos: [0, 2,  10] as [number,number,number], size: [20, 4, 0.12] as [number,number,number] },
        { pos: [-10, 2, 0] as [number,number,number], size: [0.12, 4, 20] as [number,number,number] },
        { pos: [ 10, 2, 0] as [number,number,number], size: [0.12, 4, 20] as [number,number,number] },
      ]).map(({ pos, size }, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={size} />
          <meshLambertMaterial color="#505046" />
        </mesh>
      ))}
      <Desk position={[-6, 0, -6]} />
      <Desk position={[ 5, 0, -7]} />
      <Desk position={[-7, 0,  5]} />
      <Desk position={[ 4, 0,  6]} />
      <Desk position={[ 0, 0, -5]} />

      <ambientLight intensity={1.2} color="#d8e8ff" />
      <pointLight position={[ 0, 3.6,  0]} intensity={8}   color="#fff5d0" castShadow distance={20} />
      <pointLight position={[-5, 3.6, -5]} intensity={6}   color="#fff5d0" distance={16} />
      <pointLight position={[ 5, 3.6,  5]} intensity={6}   color="#fff5d0" distance={16} />
      <pointLight position={[-5, 3.6,  5]} intensity={5}   color="#fff5d0" distance={15} />
      <pointLight position={[ 5, 3.6, -5]} intensity={5}   color="#fff5d0" distance={15} />
    </group>
  )
}

function MessItem({
  mess,
  highlighted,
  beingCleaned,
}: {
  mess: Mess
  highlighted: boolean
  beingCleaned: boolean
}) {
  if (mess.cleaned && !beingCleaned) return null
  const flash = beingCleaned

  if (mess.type === 'spill') {
    return (
      <mesh position={[mess.x, 0.006, mess.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 20]} />
        <meshLambertMaterial
          color={flash ? '#ffffff' : highlighted ? '#ffe000' : '#6b3010'}
          emissive={highlighted || flash ? '#443300' : '#000000'}
        />
      </mesh>
    )
  }

  return (
    <group position={[mess.x, 0, mess.z]}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.28]} />
        <meshLambertMaterial
          color={flash ? '#ffffff' : highlighted ? '#ffe000' : '#2a5a2a'}
          emissive={highlighted || flash ? '#443300' : '#000000'}
        />
      </mesh>
      <mesh position={[0.12, 0.06, 0.08]}>
        <boxGeometry args={[0.18, 0.12, 0.15]} />
        <meshLambertMaterial
          color={flash ? '#ffffff' : highlighted ? '#ffe000' : '#c0b890'}
          emissive={highlighted || flash ? '#443300' : '#000000'}
        />
      </mesh>
    </group>
  )
}

export default function Game() {
  const [messes, setMesses]       = useState<Mess[]>(() => INITIAL_MESSES.map(m => ({ ...m })))
  const [nearbyId, setNearbyId]   = useState<number | null>(null)
  const [cleaningId, setCleaningId] = useState<number | null>(null)
  const [won, setWon]             = useState(false)
  const [restartKey, setRestartKey] = useState(0)
  const messesRef = useRef(messes)
  messesRef.current = messes

  const cleanedCount = messes.filter(m => m.cleaned).length

  const handleClean = useCallback((id: number) => {
    setCleaningId(id)
    setTimeout(() => {
      setCleaningId(null)
      setMesses(prev => {
        const next = prev.map(m => m.id === id ? { ...m, cleaned: true } : m)
        if (next.every(m => m.cleaned)) setWon(true)
        return next
      })
    }, 220)
  }, [])

  const restart = useCallback(() => {
    setMesses(INITIAL_MESSES.map(m => ({ ...m })))
    setWon(false)
    setNearbyId(null)
    setCleaningId(null)
    setRestartKey(k => k + 1)
  }, [])

  return (
    <div className="relative w-full h-full bg-black">
      <Canvas
        key={restartKey}
        shadows
        camera={{ fov: 65, near: 0.1, far: 50, position: [0, 6.5, 12] }}
        style={{ width: '100%', height: '100%' }}
      >
        <fog attach="fog" args={['#0f0f0a', 14, 38]} />
        <Room />
        <JanitorCloset />
        {messes.map(m => (
          <MessItem
            key={m.id}
            mess={m}
            highlighted={nearbyId === m.id}
            beingCleaned={cleaningId === m.id}
          />
        ))}
        <Player
          messesRef={messesRef as React.RefObject<Mess[]>}
          onNearbyChange={setNearbyId}
          onClean={handleClean}
        />
      </Canvas>

      {/* HUD */}
      {!won && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-white text-sm font-mono tracking-wide">
            {cleanedCount} / {INITIAL_MESSES.length} cleaned
          </div>
          {nearbyId !== null && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/75 px-5 py-2 rounded-lg text-yellow-300 font-mono text-sm animate-pulse">
              [E] Clean
            </div>
          )}
          <div className="absolute bottom-5 left-5 text-slate-600 text-xs font-mono leading-relaxed">
            <div>WASD — move</div>
            <div>E — clean nearby mess</div>
          </div>
        </div>
      )}

      {/* Win screen */}
      {won && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85">
          <div className="text-center space-y-5">
            <div className="text-6xl">✨</div>
            <h1 className="text-4xl font-bold text-white">Spotless!</h1>
            <p className="text-slate-400">The office is perfectly clean.</p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={restart}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors"
              >
                Play Again
              </button>
              <Link
                href="/games"
                className="px-6 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Games
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
