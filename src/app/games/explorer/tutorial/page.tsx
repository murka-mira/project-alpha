"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Constants ──────────────────────────────────────────────────────────────────
const SPX = 3;
const SPRITE_W = 12 * SPX;
const SPRITE_H = 14 * SPX;
const TS = 32;
const SPEED = 4;
const PLAYER_MAX_HP = 100;
const PLAYER_IFRAMES = 40;
const SWING_FRAMES = 18;
const SWING_AMP = 1.3;
const BLADE_REACH = 30;
const MONSTER_RADIUS = 14;
const LOS_RANGE = 300;
const CHASE_SPEED = 1.1;
const ATTACK_CD = 240;
const CLAW_FRAMES = 60;
const CLAW_REACH = 34;
const CLAW_SWEEP = 2.0;
const CLAW_HIT_R = 20;

type Dir = "down" | "up" | "left" | "right";

// ── Sprites ────────────────────────────────────────────────────────────────────
const SC: Record<string, string | null> = {
  ".": null, G: "#2d6a4f", g: "#40916c", H: "#e9c46a", S: "#fddcb4",
  e: "#1a1a2e", M: "#c9736a", T: "#52b788", B: "#8b5e3c",
};
const HEAD_DOWN = ["..gggggg....",".gggggggg...",".GHHHHHHHG..",".GSSSSSSSG..",".GSeSSSeSG..",".GSSSSSSSG..",".GSSSMMSSG.."];
const HEAD_UP   = ["..gggggg....",".gggggggg...",".gggggggggg.",".gggggggggg.","..gggggggg..","..gggggggg..","...ggSSSgg.."];
const HEAD_LEFT = ["....gggggg..","...gggggggg.","..GHHHHGgg..","..GSSSHGg...","..GeSSSGg...","..GSSSSGg...","..GSMMSGg..."];
const BODY   = ["TTTTTTTTTTTT",".TTTTTTTTTT.",".TTTTTTTTTT."];
const LEGS_0 = ["..BBTTTBB...","..BBTTTBB...","..BB...BB...","..BB...BB..."];
const LEGS_1 = ["..BBTTTBB...","..BBTTTBB...",".BB.....BB..",".BB.....BB.."];

function renderRows(ctx: CanvasRenderingContext2D, rows: string[], startRow: number) {
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const col = SC[ch]; if (!col) return;
    ctx.fillStyle = col; ctx.fillRect(x * SPX, (startRow + y) * SPX, SPX, SPX);
  }));
}
function buildFrame(dir: Dir, lf: 0 | 1): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = SPRITE_W; c.height = SPRITE_H;
  const ctx = c.getContext("2d")!;
  renderRows(ctx, dir === "up" ? HEAD_UP : dir === "down" ? HEAD_DOWN : HEAD_LEFT, 0);
  renderRows(ctx, BODY, 7); renderRows(ctx, lf === 0 ? LEGS_0 : LEGS_1, 10);
  if (dir !== "right") return c;
  const f = document.createElement("canvas"); f.width = SPRITE_W; f.height = SPRITE_H;
  const fctx = f.getContext("2d")!; fctx.translate(SPRITE_W, 0); fctx.scale(-1, 1); fctx.drawImage(c, 0, 0);
  return f;
}
type SpriteSet = { [K in Dir]: [HTMLCanvasElement, HTMLCanvasElement] };
function buildSprites(): SpriteSet {
  return {
    down:  [buildFrame("down",  0), buildFrame("down",  1)],
    up:    [buildFrame("up",    0), buildFrame("up",    1)],
    left:  [buildFrame("left",  0), buildFrame("left",  1)],
    right: [buildFrame("right", 0), buildFrame("right", 1)],
  };
}

// ── Tutorial map (open arena) ──────────────────────────────────────────────────
const MAP_W = 24, MAP_H = 18;
const MAP: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
const SPAWN_X = 3 * TS;
const SPAWN_Y = 9 * TS;

function isSolid(tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  return MAP[ty][tx] === 1;
}
function canMoveTo(nx: number, ny: number): boolean {
  const pad = 3;
  return [[nx+pad,ny+pad],[nx+SPRITE_W-pad,ny+pad],[nx+pad,ny+SPRITE_H-pad],[nx+SPRITE_W-pad,ny+SPRITE_H-pad]]
    .every(([cx,cy]) => !isSolid(Math.floor(cx/TS), Math.floor(cy/TS)));
}

// ── Sword ──────────────────────────────────────────────────────────────────────
const SWORD_HAND: Record<Dir, { dx: number; dy: number; a: number }> = {
  right: { dx: SPRITE_W + 2, dy: 25, a:  0.0 },
  left:  { dx: -2,           dy: 25, a:  Math.PI },
  down:  { dx: SPRITE_W - 2, dy: 31, a:  1.2 },
  up:    { dx: SPRITE_W - 2, dy: 19, a: -1.2 },
};
function drawEquippedSword(ctx: CanvasRenderingContext2D, px: number, py: number, dir: Dir, swing: number) {
  const { dx, dy, a } = SWORD_HAND[dir];
  const hx = px + dx, hy = py + dy;
  const t = swing > 0 ? 1 - swing / SWING_FRAMES : 0;
  const tE = 1 - (1 - t) ** 3;
  const ao = swing > 0 ? (tE - 0.5) * SWING_AMP * 2 : 0;
  if (swing > 0) {
    const as = a - SWING_AMP, ae = a - SWING_AMP + tE * SWING_AMP * 2;
    ctx.save(); ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(hx, hy, 26, as, ae, false);
    ctx.strokeStyle = "rgba(255,230,80,0.30)"; ctx.lineWidth = 12; ctx.stroke();
    ctx.beginPath(); ctx.arc(hx, hy, 26, as, ae, false);
    ctx.strokeStyle = "rgba(255,255,210,0.55)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  }
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + ao);
  ctx.fillStyle = "#C0C0D0"; ctx.fillRect(4, -2, 20, 3);
  ctx.fillStyle = "#E8E8FF"; ctx.fillRect(4, -3, 20, 1);
  ctx.fillStyle = "#9090A8"; ctx.fillRect(23, -1, 2, 1);
  ctx.fillStyle = "#C8A000"; ctx.fillRect(1, -5, 3, 10);
  ctx.fillStyle = "#6B3A1F"; ctx.fillRect(-9, -2, 10, 3);
  ctx.fillStyle = "#3A1A08"; ctx.fillRect(-13, -3, 4, 5);
  ctx.restore();
}

// ── Monster ────────────────────────────────────────────────────────────────────
interface MonsterState {
  x: number; y: number; hp: number; maxHp: number;
  wobbleTick: number; vx: number; vy: number; moveTimer: number;
  hitCooldown: number; hitFlash: number; aggroed: boolean;
  attackCooldown: number; clawSwing: number; clawAngle: number;
  clawHit: boolean; freezeTimer: number;
}
function canMonsterMoveTo(cx: number, cy: number): boolean {
  const r = MONSTER_RADIUS - 3;
  return [cx-r,cx+r].flatMap(px => [cy-r,cy+r].map(py => [px,py]))
    .every(([px,py]) => !isSolid(Math.floor(px/TS), Math.floor(py/TS)));
}
function normalizeAngle(a: number): number {
  while (a >  Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

const MSX = 3;
const BLOB_C: Record<string, string | null> = {
  ".": null, D: "#1b4d30", G: "#2d8a4e", g: "#4ecb71", h: "#a0f0b0", e: "#0d1017", m: "#0d1f10",
};
const BLOB_FC: Record<string, string | null> = {
  ".": null, D: "#6a1a1a", G: "#cc3333", g: "#ff7777", h: "#ffbbbb", e: "#200808", m: "#3a0000",
};
const BLOB_ART: [string[], string[]] = [
  [
    "....DDDD....", "..DDGGGGDD..", ".DDGggggGDD.", ".DDGghhgGDD.",
    ".DGggggggGD.", ".DGgeggegGD.", ".DGggggggGD.", ".DGgmggmgGD.",
    ".DDGggggGDD.", "..DDGGGGDD..", "....DDDD....", "............",
  ],
  [
    "............", "....DDDD....", "..DDGGGGDD..", ".DDGghhgGDD.",
    "DDGgggggggDD", "DDGgegggegDD", "DDGgggggggDD", "DDGgmgggmgDD",
    ".DDGggggGDD.", "..DDGGGGDD..", "....DDDD....", "............",
  ],
];

function drawMonster(ctx: CanvasRenderingContext2D, m: MonsterState, camX: number, camY: number) {
  const sx = Math.round(m.x - camX), sy = Math.round(m.y - camY);
  const renderW = 12 * MSX, renderH = 12 * MSX;
  const ox = sx - renderW / 2, oy = sy - renderH / 2;
  const frame = BLOB_ART[Math.floor(m.wobbleTick / 15) % 2];
  const colors = m.hitFlash > 0 ? BLOB_FC : BLOB_C;

  ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#000";
  ctx.fillRect(ox + 4, sy + renderH / 2 - 3, renderW - 8, 5); ctx.restore();

  if (m.clawSwing > 0) {
    const t = 1 - m.clawSwing / CLAW_FRAMES;
    const sa = m.clawAngle - (CLAW_SWEEP - 0.2), ca = sa + t * CLAW_SWEEP;
    ctx.save(); ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(sx, sy, CLAW_REACH, sa, ca, false);
    ctx.strokeStyle = "rgba(60,200,60,0.18)"; ctx.lineWidth = 14; ctx.stroke();
    ctx.beginPath(); ctx.arc(sx, sy, CLAW_REACH, sa, ca, false);
    ctx.strokeStyle = "rgba(30,130,30,0.55)"; ctx.lineWidth = 3; ctx.stroke();
    const tipX = sx + Math.cos(ca) * CLAW_REACH, tipY = sy + Math.sin(ca) * CLAW_REACH;
    ctx.strokeStyle = "#1b4d30"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tipX, tipY); ctx.stroke(); ctx.restore();
  }

  frame.forEach((row, y) => [...row].forEach((ch, x) => {
    const color = colors[ch]; if (!color) return;
    ctx.fillStyle = color; ctx.fillRect(ox + x * MSX, oy + y * MSX, MSX, MSX);
  }));

  if (m.clawSwing > 0) {
    const t = 1 - m.clawSwing / CLAW_FRAMES;
    const sa = m.clawAngle - (CLAW_SWEEP - 0.2), ca = sa + t * CLAW_SWEEP;
    const tipX = sx + Math.cos(ca) * CLAW_REACH, tipY = sy + Math.sin(ca) * CLAW_REACH;
    ctx.save(); ctx.translate(tipX, tipY); ctx.rotate(ca);
    ctx.strokeStyle = "#0d2214"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(12,-6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(14,0);  ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(12,6);  ctx.stroke();
    ctx.restore();
  }

  const barW = renderW, barX = sx - barW / 2, barY = oy - 10;
  ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(barX, barY, barW, 4);
  const pct = m.hp / m.maxHp;
  ctx.fillStyle = pct > 0.5 ? "#44dd44" : pct > 0.25 ? "#dddd22" : "#dd3333";
  ctx.fillRect(barX, barY, Math.round(barW * pct), 4);
}

// ── Tutorial steps ─────────────────────────────────────────────────────────────
const STEPS = [
  { title: "MOVE",           desc: "Use WASD to walk around the arena",  keys: ["W","A","S","D"] },
  { title: "EQUIP SWORD",    desc: "Press 1 to equip your sword",         keys: ["1"] },
  { title: "SWING SWORD",    desc: "Press SPACE to attack",               keys: ["SPACE"] },
  { title: "OPEN INVENTORY", desc: "Press E to open your bag, then E again to close", keys: ["E"] },
  { title: "DEFEAT THE ENEMY", desc: "A monster appeared — kill it!",    keys: [] },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function Tutorial() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const invOpenRef   = useRef(false);

  const [step, setStep]           = useState(0);
  const [playerHp, setPlayerHp]   = useState(PLAYER_MAX_HP);
  const [swordEquipped, setSword] = useState(false);
  const [inventoryOpen, setInv]   = useState(false);
  const [dead, setDead]           = useState(false);
  const [done, setDone]           = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    function resize() {
      const el = containerRef.current; if (!el) return;
      canvas.width = el.clientWidth; canvas.height = el.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const sprites      = buildSprites();
    const keys         = new Set<string>();
    const stepRef      = { current: 0 };
    const equippedRef  = { current: false };
    const swingRef     = { current: 0 };
    const dirRef       = { current: "down" as Dir };
    const walkTickRef  = { current: 0 };
    const walkFrameRef = { current: 0 as 0 | 1 };
    const deadRef      = { current: false };
    const doneRef      = { current: false };
    const pHpRef       = { current: PLAYER_MAX_HP };
    const pHitCD       = { current: 0 };
    const pHitFlash    = { current: 0 };
    const movedRef     = { current: false };
    const attackedRef  = { current: false };
    const invDoneRef   = { current: false };
    const invWasOpen   = { current: false };

    const player = { x: SPAWN_X, y: SPAWN_Y };
    let monster: MonsterState | null = null;

    function advance() {
      const next = stepRef.current + 1;
      stepRef.current = next;
      setStep(next);
      if (next === 4) {
        monster = {
          x: (MAP_W - 4) * TS, y: 9 * TS,
          hp: 30, maxHp: 30, wobbleTick: 0,
          vx: 0, vy: 0, moveTimer: 60,
          hitCooldown: 0, hitFlash: 0, aggroed: false,
          attackCooldown: 0, clawSwing: 0, clawAngle: 0,
          clawHit: false, freezeTimer: 0,
        };
      }
      if (next >= 5) { doneRef.current = true; setDone(true); }
    }

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (["w","a","s","d"," "].includes(k)) e.preventDefault();

      if (k === "e") {
        const next = !invOpenRef.current;
        invOpenRef.current = next;
        setInv(next);
        if (next) invWasOpen.current = true;
        if (!next && invWasOpen.current) { invWasOpen.current = false; invDoneRef.current = true; }
        return;
      }
      if (k === "1") {
        equippedRef.current = !equippedRef.current;
        setSword(equippedRef.current);
        return;
      }
      if (k === " ") {
        if (equippedRef.current && swingRef.current === 0) {
          swingRef.current = SWING_FRAMES;
          attackedRef.current = true;
        }
        return;
      }
      keys.add(k);
    }
    function onKeyUp(e: KeyboardEvent) { keys.delete(e.key.toLowerCase()); }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);

    let animId: number;

    function loop() {
      if (doneRef.current || deadRef.current) { animId = requestAnimationFrame(loop); return; }

      if (!invOpenRef.current) {
        let dx = 0, dy = 0;
        if (keys.has("w")) dy -= SPEED; if (keys.has("s")) dy += SPEED;
        if (keys.has("a")) dx -= SPEED; if (keys.has("d")) dx += SPEED;
        if (dx !== 0 || dy !== 0) {
          movedRef.current = true;
          dirRef.current = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
          if (++walkTickRef.current >= 8) { walkTickRef.current = 0; walkFrameRef.current = (walkFrameRef.current === 0 ? 1 : 0) as 0 | 1; }
        } else { walkFrameRef.current = 0; walkTickRef.current = 0; }
        if (dx !== 0 && dy !== 0) { dx = Math.round(dx * 0.707); dy = Math.round(dy * 0.707); }
        if (canMoveTo(player.x + dx, player.y))      player.x += dx;
        if (canMoveTo(player.x,      player.y + dy)) player.y += dy;
      }

      // Step progression
      const s = stepRef.current;
      if (s === 0 && movedRef.current) advance();
      if (s === 1 && equippedRef.current) advance();
      if (s === 2 && attackedRef.current) advance();
      if (s === 3 && invDoneRef.current) advance();
      if (s === 4 && monster && monster.hp <= 0) advance();

      if (pHitCD.current > 0) pHitCD.current--;
      if (pHitFlash.current > 0) pHitFlash.current--;

      // Monster AI
      if (monster && monster.hp > 0 && !invOpenRef.current) {
        const m = monster;
        const pcx = player.x + SPRITE_W / 2, pcy = player.y + SPRITE_H / 2;
        m.wobbleTick++;
        if (m.hitCooldown    > 0) m.hitCooldown--;
        if (m.hitFlash       > 0) m.hitFlash--;
        if (m.attackCooldown > 0) m.attackCooldown--;
        if (m.freezeTimer    > 0) m.freezeTimer--;
        const dist = Math.hypot(m.x - pcx, m.y - pcy);
        if (!m.aggroed && dist < LOS_RANGE) m.aggroed = true;
        if (m.aggroed && m.clawSwing === 0 && m.attackCooldown === 0 && m.freezeTimer === 0 && dist <= CLAW_REACH + 20) {
          m.clawSwing = CLAW_FRAMES; m.clawAngle = Math.atan2(pcy - m.y, pcx - m.x);
          m.clawHit = false; m.attackCooldown = ATTACK_CD; m.freezeTimer = 240;
        }
        if (m.clawSwing > 0) {
          m.vx = 0; m.vy = 0;
          const t = 1 - m.clawSwing / CLAW_FRAMES;
          const sa = m.clawAngle - (CLAW_SWEEP - 0.2), ca = sa + t * CLAW_SWEEP;
          const tipX = m.x + Math.cos(ca) * CLAW_REACH, tipY = m.y + Math.sin(ca) * CLAW_REACH;
          if (!m.clawHit && pHitCD.current === 0 && Math.hypot(tipX - pcx, tipY - pcy) < CLAW_HIT_R) {
            m.clawHit = true;
            pHpRef.current = Math.max(0, pHpRef.current - 15);
            setPlayerHp(pHpRef.current);
            pHitCD.current = PLAYER_IFRAMES; pHitFlash.current = 14;
            if (pHpRef.current <= 0) { deadRef.current = true; setDead(true); }
          }
          m.clawSwing--;
        } else if (m.freezeTimer > 0) {
          m.vx = 0; m.vy = 0;
        } else if (m.aggroed) {
          const angle = Math.atan2(pcy - m.y, pcx - m.x);
          m.vx = Math.cos(angle) * CHASE_SPEED; m.vy = Math.sin(angle) * CHASE_SPEED;
        } else {
          if (--m.moveTimer <= 0) {
            const a = Math.random() * Math.PI * 2;
            m.vx = Math.cos(a) * 0.65; m.vy = Math.sin(a) * 0.65;
            m.moveTimer = 80 + Math.floor(Math.random() * 80);
          }
        }
        const nx = m.x + m.vx, ny = m.y + m.vy;
        if (canMonsterMoveTo(nx, m.y)) m.x = nx; else m.vx = 0;
        if (canMonsterMoveTo(m.x, ny)) m.y = ny; else m.vy = 0;
      }

      // Sword hit detection
      if (swingRef.current > 0 && equippedRef.current && monster && monster.hp > 0 && monster.hitCooldown === 0) {
        const t = 1 - swingRef.current / SWING_FRAMES;
        const tE = 1 - (1 - t) ** 3;
        const { dx, dy, a } = SWORD_HAND[dirRef.current];
        const hx = player.x + dx, hy = player.y + dy;
        const sweepAngle = a + (tE - 0.5) * SWING_AMP * 2;
        if (Math.hypot(monster.x - hx, monster.y - hy) <= BLADE_REACH + MONSTER_RADIUS) {
          const toMon = Math.atan2(monster.y - hy, monster.x - hx);
          if (Math.abs(normalizeAngle(toMon - sweepAngle)) < SWING_AMP) {
            monster.hp = Math.max(0, monster.hp - 10);
            monster.hitCooldown = 30; monster.hitFlash = 10;
          }
        }
      }

      // Render
      const W = canvas.width, H = canvas.height;
      const camX = player.x + SPRITE_W / 2 - W / 2;
      const camY = player.y + SPRITE_H / 2 - H / 2;
      ctx.clearRect(0, 0, W, H);

      const c0 = Math.max(0, Math.floor(camX / TS)), c1 = Math.min(MAP_W, Math.ceil((camX + W) / TS) + 1);
      const r0 = Math.max(0, Math.floor(camY / TS)), r1 = Math.min(MAP_H, Math.ceil((camY + H) / TS) + 1);

      for (let r = r0; r < r1; r++) for (let c = c0; c < c1; c++) {
        const tile = MAP[r][c];
        const sx = Math.round(c * TS - camX), sy = Math.round(r * TS - camY);
        if (tile === 0) {
          ctx.fillStyle = "#c8a45a"; ctx.fillRect(sx, sy, TS, TS);
          ctx.fillStyle = "rgba(255,220,130,0.35)";
          ctx.fillRect(sx + ((c*7+r*3)%22)+2, sy + ((c*5+r*11)%20)+2, 2, 2);
          ctx.fillRect(sx + ((c*13+r*7)%18)+4, sy + ((c*9+r*4)%24)+4, 2, 2);
          ctx.fillStyle = "rgba(0,0,0,0.06)";
          ctx.fillRect(sx, sy, 1, TS); ctx.fillRect(sx, sy, TS, 1);
        } else {
          ctx.fillStyle = "#3d2e1e"; ctx.fillRect(sx, sy, TS, TS);
          ctx.fillStyle = "#2a1f12";
          const off = r % 2 === 0 ? 0 : 16;
          ctx.fillRect(sx, sy + 15, TS, 2); ctx.fillRect(sx + off, sy, 2, 15);
          ctx.fillRect(sx + ((off+16)%TS), sy+17, 2, 15);
          ctx.fillStyle = "#5a4030"; ctx.fillRect(sx+3, sy+3, 7, 4); ctx.fillRect(sx+off+4, sy+20, 5, 3);
        }
      }

      if (monster && monster.hp > 0) drawMonster(ctx, monster, camX, camY);

      const spx = Math.round(player.x - camX), spy = Math.round(player.y - camY);
      ctx.drawImage(sprites[dirRef.current][walkFrameRef.current], spx, spy);
      if (swingRef.current > 0) swingRef.current--;
      if (equippedRef.current) drawEquippedSword(ctx, spx, spy, dirRef.current, swingRef.current);

      if (pHitFlash.current > 0) {
        ctx.save(); ctx.globalAlpha = (pHitFlash.current / 14) * 0.45;
        ctx.fillStyle = "#cc0000"; ctx.fillRect(0, 0, W, H); ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      window.removeEventListener("resize",  resize);
    };
  }, []);

  const stepDef = STEPS[Math.min(step, STEPS.length - 1)];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm border-b border-white/10 font-mono text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-yellow-300 font-bold tracking-widest">VOID EXPLORER — TUTORIAL</span>
          <div className="flex items-center gap-0.5" title={`${playerHp} / ${PLAYER_MAX_HP} HP`}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} style={{ fontSize: 13, lineHeight: 1, color: i < Math.ceil(playerHp / 10) ? (playerHp <= 20 ? "#ff2222" : "#ff5555") : "#3a1a1a", textShadow: i < Math.ceil(playerHp / 10) ? "0 0 4px #ff0000" : "none" }}>♥</span>
            ))}
          </div>
        </div>
        {/* Step progress dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <span
                style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: i < step ? "#4ade80" : i === step ? "#fde047" : "rgba(255,255,255,0.15)",
                  boxShadow: i === step ? "0 0 6px #fde047" : "none",
                  transition: "background 0.3s",
                }}
                title={s.title}
              />
              {i < STEPS.length - 1 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 8 }}>—</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 tracking-widest">[1] {swordEquipped ? <span className="text-green-400">SWORD ✓</span> : "EQUIP"}</span>
          <Link href="/games/explorer" className="hover:text-white transition-colors tracking-widest">← MENU</Link>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        <canvas ref={canvasRef} style={{ display: "block", imageRendering: "pixelated" }} />

        {/* Step instruction banner */}
        {!done && !dead && (
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              background: "rgba(5,8,20,0.88)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6,
              padding: "10px 18px",
              fontFamily: "monospace",
              minWidth: 260,
              maxWidth: 420,
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#666", letterSpacing: "0.1em" }}>STEP {step + 1} / {STEPS.length}</span>
              <span style={{ fontSize: 12, color: "#fde047", fontWeight: "bold", letterSpacing: "0.12em" }}>{stepDef.title}</span>
            </div>
            <p style={{ fontSize: 12, color: "#aaa", marginBottom: stepDef.keys.length > 0 ? 8 : 0, lineHeight: 1.4 }}>{stepDef.desc}</p>
            {stepDef.keys.length > 0 && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {stepDef.keys.map(k => (
                  <span key={k} style={{
                    background: "#1e2235", border: "1px solid #4a5080", color: "#e0e8ff",
                    fontSize: 11, padding: "3px 8px", borderRadius: 4, fontFamily: "monospace",
                    letterSpacing: "0.05em",
                  }}>{k}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Simple inventory overlay */}
        {inventoryOpen && !done && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", zIndex: 10 }}
            onClick={(e) => { if (e.target === e.currentTarget) { invOpenRef.current = false; setInv(false); } }}
          >
            <div style={{
              background: "#C6C6C6", padding: "20px 24px", fontFamily: "monospace",
              boxShadow: "inset -2px -2px 0 #555, inset 2px 2px 0 #fff",
            }}>
              <p style={{ fontSize: 13, color: "#333", marginBottom: 6, fontWeight: "bold" }}>Your Bag</p>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>It&apos;s empty for now — you&apos;ll find loot in the real game!</p>
              <p style={{ fontSize: 11, color: "#888" }}>Press E to close</p>
            </div>
          </div>
        )}

        {/* Dead overlay */}
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <p className="font-mono text-red-500 tracking-[0.4em] text-sm mb-4">✦ YOU WERE DEFEATED ✦</p>
            <h2 className="text-5xl font-bold font-mono text-red-400 mb-8 tracking-widest" style={{ textShadow: "0 0 30px rgba(220,0,0,0.6)" }}>
              GAME OVER
            </h2>
            <Link href="/games/explorer/tutorial" className="font-mono tracking-[0.3em] text-white border border-white/30 px-8 py-3 hover:bg-white/10 transition-colors">
              TRY AGAIN
            </Link>
          </div>
        )}

        {/* Done overlay */}
        {done && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75">
            <p className="font-mono text-green-400 tracking-[0.4em] text-sm mb-5">✦ TUTORIAL COMPLETE ✦</p>
            <h2
              className="text-4xl font-bold font-mono text-yellow-300 mb-3 tracking-widest"
              style={{ textShadow: "0 0 30px rgba(253,224,71,0.5)" }}
            >
              YOU&apos;RE READY!
            </h2>
            <p className="font-mono text-slate-400 text-sm mb-10">You know all the controls. Time for the real adventure.</p>
            <Link
              href="/games/explorer/play"
              className="font-mono tracking-[0.3em] text-white bg-sky-600 border border-sky-400/30 px-10 py-3 hover:bg-sky-500 transition-colors mb-4"
            >
              START GAME →
            </Link>
            <Link href="/games/explorer" className="font-mono text-slate-500 text-sm hover:text-slate-300 transition-colors tracking-widest">
              ← BACK TO MENU
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
