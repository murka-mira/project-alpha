'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
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

const CLEAN_RANGE = 2.2
const MOVE_SPEED = 6
const PLAYER_HEIGHT = 1.7
const PLAYER_RADIUS = 0.3

// [minX, maxX, minZ, maxZ] solid rectangles the player cannot enter
const OBSTACLES: [number, number, number, number][] = [
  // Outer room walls (0.12 thick, centred at ±10)
  [-10.06, -9.94, -10, 10],
  [  9.94, 10.06, -10, 10],
  [-10, 10, -10.06, -9.94],
  [-10, 10,   9.94, 10.06],
  // Closet side walls (x=±2, z=7..10)
  [-2.06, -1.94, 7, 10.06],
  [ 1.94,  2.06, 7, 10.06],
  // Closet front wall posts (doorway gap is x=-0.6..0.6)
  [-2.06, -0.54, 6.94, 7.06],
  [ 0.54,  2.06, 6.94, 7.06],
  // Desks: each is 2 wide × 1 deep, centred at their position
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

function Controls({
  messesRef,
  onNearbyChange,
  onClean,
  isMovingRef,
  isCleaningRef,
}: {
  messesRef: React.RefObject<Mess[]>
  onNearbyChange: (id: number | null) => void
  onClean: (id: number) => void
  isMovingRef: React.MutableRefObject<boolean>
  isCleaningRef: React.MutableRefObject<boolean>
}) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const nearbyRef = useRef<number | null>(null)
  const cb = useRef({ onNearbyChange, onClean })
  cb.current = { onNearbyChange, onClean }
  const bobT = useRef(0)

  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 8.8)

    const onDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'KeyE' && nearbyRef.current !== null) {
        cb.current.onClean(nearbyRef.current)
        isCleaningRef.current = true
        setTimeout(() => { isCleaningRef.current = false }, 500)
      }
    }
    const onUp = (e: KeyboardEvent) => { keys.current[e.code] = false }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [camera, isCleaningRef])

  useFrame((_, dt) => {
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    const velocity = new THREE.Vector3()
    if (keys.current['KeyW']) velocity.addScaledVector(forward,  1)
    if (keys.current['KeyS']) velocity.addScaledVector(forward, -1)
    if (keys.current['KeyA']) velocity.addScaledVector(right,   -1)
    if (keys.current['KeyD']) velocity.addScaledVector(right,    1)

    const moving = velocity.lengthSq() > 0
    isMovingRef.current = moving

    if (moving) {
      velocity.normalize().multiplyScalar(MOVE_SPEED * dt)
      const nx = camera.position.x + velocity.x
      const nz = camera.position.z + velocity.z
      if (!blocked(nx, nz)) {
        camera.position.x = nx
        camera.position.z = nz
      } else {
        if (!blocked(nx, camera.position.z)) camera.position.x = nx
        if (!blocked(camera.position.x, nz)) camera.position.z = nz
      }
    }

    // Head bob
    if (moving) bobT.current += dt * 9
    camera.position.y = PLAYER_HEIGHT + (moving ? Math.sin(bobT.current) * 0.04 : 0)

    const { x, z } = camera.position
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

  return <PointerLockControls />
}

function Viewmodel({
  isMovingRef,
  isCleaningRef,
}: {
  isMovingRef: React.MutableRefObject<boolean>
  isCleaningRef: React.MutableRefObject<boolean>
}) {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group | null>(null)
  const bobT = useRef(0)
  const cleanT = useRef(0)
  const wasClean = useRef(false)

  // Build geometry imperatively so R3F's reconciler never touches these objects.
  // camera.add() only works reliably when the object isn't also in R3F's scene graph.
  useEffect(() => {
    const group = new THREE.Group()

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, px: number, py: number, pz: number, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(px, py, pz)
      m.rotation.set(rx, ry, rz)
      group.add(m)
    }

    const wood   = new THREE.MeshLambertMaterial({ color: 0x8B6914 })
    const collar = new THREE.MeshLambertMaterial({ color: 0xa09060 })
    const string = new THREE.MeshLambertMaterial({ color: 0xd4cc8a })
    const skin   = new THREE.MeshLambertMaterial({ color: 0xc8856c })

    // Handle
    add(new THREE.CylinderGeometry(0.015, 0.015, 1.05, 8), wood, 0, 0.42, 0)
    // Collar
    add(new THREE.CylinderGeometry(0.072, 0.072, 0.09, 10), collar, 0, -0.12, 0)
    // Strings
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      add(new THREE.CylinderGeometry(0.005, 0.003, 0.19, 4), string,
          Math.cos(a) * 0.052, -0.22, Math.sin(a) * 0.052)
    }
    // Right forearm
    add(new THREE.BoxGeometry(0.075, 0.075, 0.21), skin, 0.055, -0.04, 0.15, -0.28, 0.08, 0.05)
    // Left forearm
    add(new THREE.BoxGeometry(0.07, 0.07, 0.18),   skin, -0.042, 0.35, -0.04, -0.18, -0.1, -0.04)

    camera.add(group)
    groupRef.current = group

    return () => {
      camera.remove(group)
      group.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          ;(o.material as THREE.Material).dispose()
        }
      })
    }
  }, [camera])

  useFrame((_, dt) => {
    const g = groupRef.current
    if (!g) return

    const moving  = isMovingRef.current
    const cleaning = isCleaningRef.current

    if (moving) bobT.current += dt * 9
    const bob  = moving ? Math.sin(bobT.current) * 0.022 : Math.sin(bobT.current * 0.4) * 0.005
    const sway = moving ? Math.sin(bobT.current * 0.5) * 0.012 : 0

    if (cleaning && !wasClean.current) cleanT.current = 0
    wasClean.current = cleaning
    if (cleaning) cleanT.current += dt * 14
    const scrub = Math.sin(cleanT.current) * Math.max(0, 1 - cleanT.current / (Math.PI * 1.5)) * 0.3

    g.position.set(0.22 + sway * 0.8, -0.52 + bob, -0.55)
    g.rotation.set(0.28 + scrub, -0.15, 0.08 + sway * 3)
  })

  return null
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

// Closet: x -2..2, z 7..10. Doorway at z=7, 1.2 wide centred, 2.4 tall.
function JanitorCloset() {
  const w = '#4a4a40'
  return (
    <group>
      {/* Side walls */}
      <mesh position={[-2, 2, 8.5]}>
        <boxGeometry args={[0.12, 4, 3]} />
        <meshLambertMaterial color={w} />
      </mesh>
      <mesh position={[2, 2, 8.5]}>
        <boxGeometry args={[0.12, 4, 3]} />
        <meshLambertMaterial color={w} />
      </mesh>

      {/* Front wall: left post, right post, header above door */}
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

      {/* Floor tint — slightly lighter tile to distinguish the closet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 8.5]}>
        <planeGeometry args={[3.76, 3]} />
        <meshLambertMaterial color="#4a4535" />
      </mesh>

      {/* ── Props ── */}

      {/* Mop bucket */}
      <mesh position={[-1.4, 0.25, 9.2]}>
        <cylinderGeometry args={[0.22, 0.18, 0.5, 12]} />
        <meshLambertMaterial color="#c8a020" />
      </mesh>
      {/* Mop handle */}
      <mesh position={[-1.4, 1.25, 9.2]} rotation={[0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
        <meshLambertMaterial color="#8B6914" />
      </mesh>
      {/* Mop head */}
      <mesh position={[-1.4, 0.06, 9.2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 12]} />
        <meshLambertMaterial color="#ddddc8" />
      </mesh>

      {/* Shelf bracket east wall */}
      {([0.55, 1.15, 1.75] as number[]).map((y, i) => (
        <mesh key={i} position={[1.9, y, 8.6]}>
          <boxGeometry args={[0.08, 0.05, 1.6]} />
          <meshLambertMaterial color="#6a5020" />
        </mesh>
      ))}
      {/* Items on bottom shelf */}
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
      {/* Items on middle shelf */}
      <mesh position={[1.82, 1.45, 8.2]}>
        <boxGeometry args={[0.25, 0.2, 0.35]} />
        <meshLambertMaterial color="#dddddd" />
      </mesh>
      <mesh position={[1.82, 1.45, 8.8]}>
        <boxGeometry args={[0.2, 0.18, 0.28]} />
        <meshLambertMaterial color="#eecc44" />
      </mesh>

      {/* Overhead bulb */}
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
  const [messes, setMesses] = useState<Mess[]>(() => INITIAL_MESSES.map(m => ({ ...m })))
  const [nearbyId, setNearbyId] = useState<number | null>(null)
  const [cleaningId, setCleaningId] = useState<number | null>(null)
  const [won, setWon] = useState(false)
  const [locked, setLocked] = useState(false)
  const messesRef = useRef(messes)
  messesRef.current = messes
  const isMovingRef = useRef(false)
  const isCleaningRef = useRef(false)

  const cleanedCount = messes.filter(m => m.cleaned).length

  useEffect(() => {
    const onChange = () => setLocked(!!document.pointerLockElement)
    document.addEventListener('pointerlockchange', onChange)
    return () => document.removeEventListener('pointerlockchange', onChange)
  }, [])

  const handleClean = useCallback((id: number) => {
    setCleaningId(id)
    setTimeout(() => {
      setCleaningId(null)
      setMesses(prev => {
        const next = prev.map(m => m.id === id ? { ...m, cleaned: true } : m)
        if (next.every(m => m.cleaned)) {
          setWon(true)
          document.exitPointerLock()
        }
        return next
      })
    }, 220)
  }, [])

  const restart = useCallback(() => {
    setMesses(INITIAL_MESSES.map(m => ({ ...m })))
    setWon(false)
    setNearbyId(null)
    setCleaningId(null)
  }, [])

  return (
    <div className="relative w-full h-full bg-black">
      <Canvas
        shadows
        camera={{ fov: 80, near: 0.1, far: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <fog attach="fog" args={['#0f0f0a', 12, 35]} />
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
        <Controls
          messesRef={messesRef as React.RefObject<Mess[]>}
          onNearbyChange={setNearbyId}
          onClean={handleClean}
          isMovingRef={isMovingRef}
          isCleaningRef={isCleaningRef}
        />
        <Viewmodel isMovingRef={isMovingRef} isCleaningRef={isCleaningRef} />
      </Canvas>

      {/* HUD — only while locked and playing */}
      {locked && !won && (
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-5 h-5">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/70" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/70" />
            </div>
          </div>
          {/* Progress */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-white text-sm font-mono tracking-wide">
            {cleanedCount} / {INITIAL_MESSES.length} cleaned
          </div>
          {/* Clean prompt */}
          {nearbyId !== null && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/75 px-5 py-2 rounded-lg text-yellow-300 font-mono text-sm animate-pulse">
              [E] Clean
            </div>
          )}
          {/* Controls hint */}
          <div className="absolute bottom-5 left-5 text-slate-600 text-xs font-mono leading-relaxed">
            <div>WASD — move</div>
            <div>Mouse — look</div>
            <div>ESC — pause</div>
          </div>
        </div>
      )}

      {/* Start / paused overlay */}
      {!locked && !won && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center space-y-5">
            <div className="text-6xl">🧹</div>
            <h1 className="text-4xl font-bold text-white">Janitor</h1>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              The office is a disaster. Find all {INITIAL_MESSES.length} messes and clean them up.
            </p>
            {cleanedCount > 0 && (
              <p className="text-sky-400 text-sm font-mono">{cleanedCount} / {INITIAL_MESSES.length} cleaned</p>
            )}
            <div className="text-slate-500 text-xs font-mono space-y-1">
              <div>WASD — move &nbsp;·&nbsp; Mouse — look &nbsp;·&nbsp; E — clean</div>
            </div>
            <p className="text-sky-400 text-sm animate-pulse">Click anywhere to play</p>
            <Link
              href="/games"
              className="block text-slate-600 hover:text-slate-400 text-xs transition-colors"
            >
              ← Back to games
            </Link>
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
