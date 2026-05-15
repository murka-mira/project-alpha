"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Sprite ─────────────────────────────────────────────────────────────────────
const SPX = 3;
const SPRITE_W = 12 * SPX;
const SPRITE_H = 14 * SPX;

const SC: Record<string, string | null> = {
  ".": null, G: "#2d6a4f", g: "#40916c",
  H: "#e9c46a", S: "#fddcb4", e: "#1a1a2e",
  M: "#c9736a", T: "#52b788", B: "#8b5e3c",
};

const HEAD_DOWN = [
  "..gggggg....",
  ".gggggggg...",
  ".GHHHHHHHG..",
  ".GSSSSSSSG..",
  ".GSeSSSeSG..",
  ".GSSSSSSSG..",
  ".GSSSMMSSG..",
];

const HEAD_UP = [
  "..gggggg....",
  ".gggggggg...",
  ".gggggggggg.",
  ".gggggggggg.",
  "..gggggggg..",
  "..gggggggg..",
  "...ggSSSgg..",
];

const HEAD_LEFT = [
  "....gggggg..",
  "...gggggggg.",
  "..GHHHHGgg..",
  "..GSSSHGg...",
  "..GeSSSGg...",
  "..GSSSSGg...",
  "..GSMMSGg...",
];

const BODY = [
  "TTTTTTTTTTTT",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
];

const LEGS_0 = [
  "..BBTTTBB...",
  "..BBTTTBB...",
  "..BB...BB...",
  "..BB...BB...",
];

const LEGS_1 = [
  "..BBTTTBB...",
  "..BBTTTBB...",
  ".BB.....BB..",
  ".BB.....BB..",
];

type Dir = "down" | "up" | "left" | "right";

function renderRows(ctx: CanvasRenderingContext2D, rows: string[], startRow: number) {
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const col = SC[ch];
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(x * SPX, (startRow + y) * SPX, SPX, SPX);
    })
  );
}

function buildFrame(dir: Dir, legsFrame: 0 | 1): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = SPRITE_W; c.height = SPRITE_H;
  const ctx = c.getContext("2d")!;

  const head = dir === "up" ? HEAD_UP : dir === "down" ? HEAD_DOWN : HEAD_LEFT;
  renderRows(ctx, head, 0);
  renderRows(ctx, BODY, 7);
  renderRows(ctx, legsFrame === 0 ? LEGS_0 : LEGS_1, 10);

  if (dir !== "right") return c;

  const f = document.createElement("canvas");
  f.width = SPRITE_W; f.height = SPRITE_H;
  const fctx = f.getContext("2d")!;
  fctx.translate(SPRITE_W, 0);
  fctx.scale(-1, 1);
  fctx.drawImage(c, 0, 0);
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

// ── Tiles ──────────────────────────────────────────────────────────────────────
const TS = 32;
const MAP_W = 40, MAP_H = 30, SPEED = 4;

// ── Maze generation (DFS / recursive backtracker) ──────────────────────────────
function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type MazeDef = { cellW: number; cellH: number; seed: number };

function buildMazeMap(def: MazeDef) {
  const { cellW, cellH, seed } = def;
  const rng = seededRng(seed);
  // stride=3: each cell is 2×2 tiles, walls are 1 tile — gives 2-tile-wide passages
  const S = 3;
  const tW = cellW * S + 1;
  const tH = cellH * S + 1;

  // 0 = floor, 1 = wall
  const tiles: number[][] = Array.from({ length: tH }, () => Array(tW).fill(1));
  const visited: boolean[][] = Array.from({ length: cellH }, () => Array(cellW).fill(false));

  function carve(cx: number, cy: number) {
    visited[cy][cx] = true;
    // Carve the 2×2 cell block
    tiles[cy * S + 1][cx * S + 1] = 0;
    tiles[cy * S + 1][cx * S + 2] = 0;
    tiles[cy * S + 2][cx * S + 1] = 0;
    tiles[cy * S + 2][cx * S + 2] = 0;

    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < cellW && ny >= 0 && ny < cellH && !visited[ny][nx]) {
        // Carve the 2-tile-wide passage between the two cells
        if (dx === 1) {
          tiles[cy * S + 1][cx * S + 3] = 0;
          tiles[cy * S + 2][cx * S + 3] = 0;
        } else if (dx === -1) {
          tiles[cy * S + 1][cx * S    ] = 0;
          tiles[cy * S + 2][cx * S    ] = 0;
        } else if (dy === 1) {
          tiles[cy * S + 3][cx * S + 1] = 0;
          tiles[cy * S + 3][cx * S + 2] = 0;
        } else {
          tiles[cy * S    ][cx * S + 1] = 0;
          tiles[cy * S    ][cx * S + 2] = 0;
        }
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);

  const offC = Math.floor((MAP_W - tW) / 2);
  const offR = Math.floor((MAP_H - tH) / 2);

  // Embed maze in full 40×30 map (all 1s outside)
  const map: number[][] = Array.from({ length: MAP_H }, (_, r) =>
    Array.from({ length: MAP_W }, (_, c) => {
      const mr = r - offR, mc = c - offC;
      if (mr < 0 || mr >= tH || mc < 0 || mc >= tW) return 1;
      return tiles[mr][mc];
    })
  );

  // Player starts at cell (0,0) — top-left tile of that cell
  const spawnTileX = offC + 1;
  const spawnTileY = offR + 1;

  // Exit door at cell (cellW-1, cellH-1) — top-left tile of that cell
  const doorTileX = offC + (cellW - 1) * S + 1;
  const doorTileY = offR + (cellH - 1) * S + 1;

  return { map, spawnTileX, spawnTileY, doorTileX, doorTileY };
}

// ── Levels ─────────────────────────────────────────────────────────────────────
// Cell counts keep tile grid ≤ 40×30: max cellW=13 (13*3+1=40), max cellH=9 (9*3+1=28)
const MAZE_DEFS: Array<{ def: MazeDef; name: string }> = [
  { def: { cellW: 5,  cellH: 4, seed: 1001 }, name: "LEVEL 1" },
  { def: { cellW: 7,  cellH: 5, seed: 2002 }, name: "LEVEL 2" },
  { def: { cellW: 9,  cellH: 7, seed: 3003 }, name: "LEVEL 3" },
  { def: { cellW: 11, cellH: 8, seed: 4004 }, name: "LEVEL 4" },
  { def: { cellW: 13, cellH: 9, seed: 5005 }, name: "LEVEL 5" },
];

type Level = {
  name: string;
  map: number[][];
  doorTileX: number;
  doorTileY: number;
  spawnX: number;
  spawnY: number;
};

const LEVELS: Level[] = MAZE_DEFS.map(({ def, name }) => {
  const { map, spawnTileX, spawnTileY, doorTileX, doorTileY } = buildMazeMap(def);
  return {
    name,
    map,
    doorTileX,
    doorTileY,
    spawnX: spawnTileX * TS,
    spawnY: spawnTileY * TS,
  };
});

// ── Helpers ────────────────────────────────────────────────────────────────────
function isSolid(map: number[][], tx: number, ty: number) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  return map[ty][tx] === 1;
}

function canMoveTo(map: number[][], nx: number, ny: number) {
  const pad = 3;
  return [
    [nx + pad,            ny + pad],
    [nx + SPRITE_W - pad, ny + pad],
    [nx + pad,            ny + SPRITE_H - pad],
    [nx + SPRITE_W - pad, ny + SPRITE_H - pad],
  ].every(([cx, cy]) => !isSolid(map, Math.floor(cx / TS), Math.floor(cy / TS)));
}

function drawDoor(ctx: CanvasRenderingContext2D, sx: number, sy: number, isExit: boolean, locked: boolean) {
  ctx.fillStyle = "#5c3a14";
  ctx.fillRect(sx - 3, sy + 4, 5, 30);
  ctx.fillRect(sx + 30, sy + 4, 5, 30);
  ctx.fillRect(sx - 3, sy, 38, 6);
  ctx.fillStyle = "#9e6e30";
  ctx.fillRect(sx - 2, sy + 5, 2, 20);
  ctx.fillRect(sx + 32, sy + 5, 2, 20);
  ctx.fillStyle = "#080318";
  ctx.fillRect(sx + 2, sy + 6, 28, 26);
  const glowColor  = locked ? "rgba(220, 50, 50, 0.8)"  : isExit ? "rgba(100, 255, 100, 0.7)" : "rgba(255, 190, 40, 0.7)";
  const glowColor2 = locked ? "rgba(220, 50, 50, 0.35)" : isExit ? "rgba(100, 255, 100, 0.3)" : "rgba(255, 190, 40, 0.3)";
  ctx.fillStyle = glowColor;
  ctx.fillRect(sx + 2, sy + 6, 28, 3);
  ctx.fillStyle = glowColor2;
  ctx.fillRect(sx + 2, sy + 9, 28, 3);
  ctx.fillStyle = "rgba(255,255,200,0.6)";
  ctx.fillRect(sx + 8,  sy + 14, 2, 2);
  ctx.fillRect(sx + 18, sy + 18, 2, 2);
  ctx.fillRect(sx + 24, sy + 12, 2, 2);
  // Lock icon when blocked
  if (locked) {
    ctx.fillStyle = "#cc2222";
    ctx.fillRect(sx + 11, sy + 16, 10, 8);
    ctx.fillStyle = "#080318";
    ctx.beginPath();
    ctx.arc(sx + 16, sy + 16, 4, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffaaaa";
    ctx.fillRect(sx + 14, sy + 19, 4, 3);
  }
  const labelColor = locked ? "#ff8888" : isExit ? "#88ff88" : "#ffd700";
  ctx.fillStyle = labelColor;
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  ctx.fillText(locked ? "LOCKED" : isExit ? "EXIT ▶" : "NEXT ▶", sx + 16, sy + 38);
  ctx.textAlign = "left";
}

// ── Equipped sword drawing ─────────────────────────────────────────────────────
// Hand anchor (dx, dy from player top-left) and blade angle per direction
const SWORD_HAND: Record<Dir, { dx: number; dy: number; a: number }> = {
  right: { dx: SPRITE_W + 2, dy: 25, a:  0.0 },
  left:  { dx: -2,           dy: 25, a:  Math.PI },
  down:  { dx: SPRITE_W - 2, dy: 31, a:  1.2 },
  up:    { dx: SPRITE_W - 2, dy: 19, a: -1.2 },
};

const SWING_FRAMES = 18;
const SWING_AMP    = 1.3; // radians swept either side of rest

function drawEquippedSword(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  dir: Dir,
  swing: number, // frames remaining (SWING_FRAMES → 0)
) {
  const { dx, dy, a } = SWORD_HAND[dir];
  const hx = px + dx;
  const hy = py + dy;

  // Swing progress 0→1 as frames count down
  const t = swing > 0 ? 1 - swing / SWING_FRAMES : 0;
  // Ease-out cubic: fast start (slash), slow finish (follow-through)
  const tEased = 1 - (1 - t) ** 3;
  const angleOffset = swing > 0 ? (tEased - 0.5) * SWING_AMP * 2 : 0;

  // Arc trail during swing
  if (swing > 0) {
    const arcStart = a - SWING_AMP;
    const arcEnd   = a - SWING_AMP + tEased * SWING_AMP * 2;
    ctx.save();
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(hx, hy, 26, arcStart, arcEnd, false);
    ctx.strokeStyle = "rgba(255, 230, 80, 0.30)";
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx, hy, 26, arcStart, arcEnd, false);
    ctx.strokeStyle = "rgba(255, 255, 210, 0.55)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(a + angleOffset);

  // Blade
  ctx.fillStyle = "#C0C0D0";
  ctx.fillRect(4, -2, 20, 3);
  ctx.fillStyle = "#E8E8FF"; // highlight
  ctx.fillRect(4, -3, 20, 1);
  ctx.fillStyle = "#9090A8"; // tip
  ctx.fillRect(23, -1, 2, 1);

  // Guard
  ctx.fillStyle = "#C8A000";
  ctx.fillRect(1, -5, 3, 10);

  // Handle
  ctx.fillStyle = "#6B3A1F";
  ctx.fillRect(-9, -2, 10, 3);

  // Pommel
  ctx.fillStyle = "#3A1A08";
  ctx.fillRect(-13, -3, 4, 5);

  ctx.restore();
}

// ── Monsters ──────────────────────────────────────────────────────────────────
const MONSTER_RADIUS = 14;
const MONSTER_SPEED  = 0.65;
const BLADE_REACH    = 30;
const MSX            = 3; // monster art scale → 12 art px × 3 = 36 screen px
const PLAYER_MAX_HP  = 100;
const LOS_RANGE      = 220;  // px — sight range
const CHASE_SPEED    = 1.3;  // px/frame when chasing
const ATTACK_RANGE   = 36;   // px — melee contact
const ATTACK_CD      = 300;  // frames between monster attacks (5 s @ 60 fps)
const PLAYER_IFRAMES = 40;   // invincibility frames after being hit

interface MonsterState {
  id: number;
  x: number; y: number;
  hp: number; maxHp: number;
  level: number;
  wobbleTick: number;
  vx: number; vy: number;
  moveTimer: number;
  hitCooldown: number;
  hitFlash: number;
  aggroed: boolean;
  attackCooldown: number;
}

function normalizeAngle(a: number): number {
  while (a >  Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function canMonsterMoveTo(map: number[][], cx: number, cy: number): boolean {
  const r = MONSTER_RADIUS - 3;
  return (
    [cx - r, cx + r].flatMap(px => [cy - r, cy + r].map(py => [px, py]))
  ).every(([px, py]) => !isSolid(map, Math.floor(px / TS), Math.floor(py / TS)));
}

function hasLineOfSight(map: number[][], x1: number, y1: number, x2: number, y2: number): boolean {
  const dx = x2 - x1, dy = y2 - y1;
  const steps = Math.ceil(Math.hypot(dx, dy) / 8);
  if (steps === 0) return true;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isSolid(map, Math.floor((x1 + dx * t) / TS), Math.floor((y1 + dy * t) / TS))) return false;
  }
  return true;
}

function spawnMonsters(level: Level, levelIdx: number): MonsterState[] {
  const count = 3 + levelIdx;
  const map   = level.map;
  const sx    = Math.floor(level.spawnX / TS);
  const sy    = Math.floor(level.spawnY / TS);

  const candidates: [number, number][] = [];
  for (let r = 0; r < MAP_H; r++)
    for (let c = 0; c < MAP_W; c++)
      if (map[r][c] === 0 && Math.hypot(c - sx, r - sy) > 5)
        candidates.push([c, r]);

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const hp = (levelIdx + 1) * 20 + 10;
  return candidates.slice(0, count).map(([c, r], i) => ({
    id: i,
    x: c * TS + TS / 2, y: r * TS + TS / 2,
    hp, maxHp: hp,
    level: levelIdx + 1,
    wobbleTick: Math.floor(Math.random() * 100),
    vx: 0, vy: 0,
    moveTimer: Math.floor(Math.random() * 80),
    hitCooldown: 0, hitFlash: 0,
    aggroed: false, attackCooldown: 0,
  }));
}

// Pixel art blob — 12×12 art at MSX scale, 2-frame hop animation
const BLOB_C: Record<string, string | null> = {
  ".": null,
  "D": "#1b4d30",  // dark outline
  "G": "#2d8a4e",  // mid green
  "g": "#4ecb71",  // light green
  "h": "#a0f0b0",  // specular highlight
  "e": "#0d1017",  // eye
  "m": "#0d1f10",  // mouth
};
const BLOB_FLASH_C: Record<string, string | null> = {
  ".": null,
  "D": "#6a1a1a",
  "G": "#cc3333",
  "g": "#ff7777",
  "h": "#ffbbbb",
  "e": "#200808",
  "m": "#3a0000",
};
const BLOB_FRAMES: [string[], string[]] = [
  // Frame 0 – standing
  [
    "....DDDD....",
    "..DDGGGGDD..",
    ".DDGggggGDD.",
    ".DDGghhgGDD.",
    ".DGggggggGD.",
    ".DGgeggegGD.",
    ".DGggggggGD.",
    ".DGgmggmgGD.",
    ".DDGggggGDD.",
    "..DDGGGGDD..",
    "....DDDD....",
    "............",
  ],
  // Frame 1 – squished (landing)
  [
    "............",
    "....DDDD....",
    "..DDGGGGDD..",
    ".DDGghhgGDD.",
    "DDGgggggggDD",
    "DDGgegggegDD",
    "DDGgggggggDD",
    "DDGgmgggmgDD",
    ".DDGggggGDD.",
    "..DDGGGGDD..",
    "....DDDD....",
    "............",
  ],
];

function drawMonster(
  ctx: CanvasRenderingContext2D,
  m: MonsterState,
  camX: number, camY: number,
) {
  const sx = Math.round(m.x - camX);
  const sy = Math.round(m.y - camY);
  const flash  = m.hitFlash > 0;
  const frame  = BLOB_FRAMES[Math.floor(m.wobbleTick / 15) % 2];
  const colors = flash ? BLOB_FLASH_C : BLOB_C;

  const renderW = 12 * MSX; // 36
  const renderH = 12 * MSX; // 36
  const ox = sx - renderW / 2;
  const oy = sy - renderH / 2;

  // Drop shadow
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#000";
  ctx.fillRect(ox + 4, sy + renderH / 2 - 3, renderW - 8, 5);
  ctx.restore();

  // Pixel art body
  frame.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const color = colors[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(ox + x * MSX, oy + y * MSX, MSX, MSX);
    })
  );

  // HP bar
  const barW = renderW, barH = 4;
  const barX = sx - barW / 2;
  const barY = oy - 10;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(barX, barY, barW, barH);
  const pct = m.hp / m.maxHp;
  ctx.fillStyle = pct > 0.5 ? "#44dd44" : pct > 0.25 ? "#dddd22" : "#dd3333";
  ctx.fillRect(barX, barY, Math.round(barW * pct), barH);

  // Level badge
  const badgeY = barY - 14;
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(sx - 13, badgeY, 26, 12);
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`Lv${m.level}`, sx, badgeY + 9);
  ctx.textAlign = "left";
}

// ── Items ──────────────────────────────────────────────────────────────────────
type Item = { id: string; name: string };

type ColorMap = Record<string, string | null>;

function drawPixelArt(ctx: CanvasRenderingContext2D, art: string[], colors: ColorMap) {
  art.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const color = colors[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    })
  );
}

const SWORD_C: ColorMap = {
  ".": null,
  "B": "#E8E8FF", // blade highlight
  "b": "#A8A8C0", // blade
  "g": "#C8A000", // gold guard
  "h": "#6B3A1F", // handle
  "p": "#3A1A08", // pommel
};
const SWORD_ART = [
  "...........B",
  "..........Bb",
  ".........Bb.",
  "........Bb..",
  ".......Bb...",
  "...gggBb....",
  "....h.......",
  "...h........",
  "..h.........",
  ".pp.........",
  "............",
  "............",
];

const LEATHER_C: ColorMap = {
  ".": null,
  "L": "#C47330", // leather main
  "l": "#DA8E50", // leather light
  "d": "#7A3010", // leather dark/strap
};
const HELMET_ART = [
  "............",
  "....llll....",
  "..llLLLLll..",
  ".lLLLLLLLLl.",
  ".lLLddddLLl.",
  ".lLLLLLLLLl.",
  ".lllllllll..",
  "............",
  "............",
  "............",
  "............",
  "............",
];
const CHEST_ART = [
  ".ll......ll.",
  "lLLl....lLLl",
  ".LLLllllLLL.",
  ".LLLLLLLLLL.",
  ".LL......LL.",
  ".LL......LL.",
  ".LL......LL.",
  ".LL......LL.",
  ".lllllllll..",
  "............",
  "............",
  "............",
];
const LEGS_ART = [
  "............",
  ".LLLLLLLLLL.",
  ".LL......LL.",
  ".LL......LL.",
  "..ll....ll..",
  "..LL....LL..",
  "..LL....LL..",
  "..LL....LL..",
  "..ll....ll..",
  "............",
  "............",
  "............",
];
const BOOTS_ART = [
  "............",
  "............",
  "....LL..LL..",
  "....LL..LL..",
  "....LL..LL..",
  "...LLL..LLL.",
  "...LLLLLLL..",
  "...ddddddd..",
  "............",
  "............",
  "............",
  "............",
];

const ITEM_DEFS: Record<string, { art: string[]; colors: ColorMap; name: string }> = {
  sword_1:            { art: SWORD_ART,  colors: SWORD_C,   name: "Sword Lv.1" },
  leather_helmet:     { art: HELMET_ART, colors: LEATHER_C, name: "Leather Helmet" },
  leather_chestplate: { art: CHEST_ART,  colors: LEATHER_C, name: "Leather Chestplate" },
  leather_leggings:   { art: LEGS_ART,   colors: LEATHER_C, name: "Leather Leggings" },
  leather_boots:      { art: BOOTS_ART,  colors: LEATHER_C, name: "Leather Boots" },
};

const STARTING_ARMOR: (Item | null)[] = [
  { id: "leather_helmet",     name: "Leather Helmet" },
  { id: "leather_chestplate", name: "Leather Chestplate" },
  { id: "leather_leggings",   name: "Leather Leggings" },
  { id: "leather_boots",      name: "Leather Boots" },
];
const STARTING_WEAPON: Item = { id: "sword_1", name: "Sword Lv.1" };
const STARTING_HOTBAR: (Item | null)[] = Array<null>(9).fill(null);
const STARTING_STORAGE: (Item | null)[] = Array<null>(27).fill(null);

function ItemIcon({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 12, 12);
    const def = ITEM_DEFS[id];
    if (def) drawPixelArt(ctx, def.art, def.colors);
  }, [id]);
  return (
    <canvas
      ref={ref}
      width={12}
      height={12}
      title={ITEM_DEFS[id]?.name}
      style={{ imageRendering: "pixelated", width: 36, height: 36, display: "block" }}
    />
  );
}

// ── Inventory UI ───────────────────────────────────────────────────────────────
const SLOT = 46;

function Slot({ item, equipped, children }: { item?: Item | null; equipped?: boolean; children?: React.ReactNode }) {
  return (
    <div className="inv-slot" style={{
      width: SLOT,
      height: SLOT,
      background: "#8B8B8B",
      boxShadow: equipped
        ? "inset -2px -2px 0 #88ff88, inset 2px 2px 0 #005500"
        : "inset -2px -2px 0 #fff, inset 2px 2px 0 #373737",
      flexShrink: 0,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "default",
    }}>
      {item && <ItemIcon id={item.id} />}
      {equipped && (
        <div style={{
          position: "absolute", bottom: 2, right: 2,
          width: 6, height: 6, background: "#55ff55",
          pointerEvents: "none",
        }} />
      )}
      {children}
    </div>
  );
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#C6C6C6",
  padding: 8,
  boxShadow: "inset -2px -2px 0 #555, inset 2px 2px 0 #fff",
  userSelect: "none",
  fontFamily: "monospace",
};

const LABEL: React.CSSProperties = {
  fontSize: 11,
  color: "#404040",
  marginBottom: 4,
  display: "block",
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function Play() {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const containerRef      = useRef<HTMLDivElement>(null);
  const inventoryCanvasRef = useRef<HTMLCanvasElement>(null);
  const spritesRef        = useRef<SpriteSet | null>(null);
  const inventoryOpenRef  = useRef(false);

  const [levelName, setLevelName]         = useState(LEVELS[0].name);
  const [won, setWon]                     = useState(false);
  const [dead, setDead]                   = useState(false);
  const [playerHp, setPlayerHp]           = useState(PLAYER_MAX_HP);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [swordEquipped, setSwordEquipped] = useState(false);
  const equippedRef                       = useRef(false);
  const swingRef                          = useRef(0);
  const [armor]   = useState<(Item | null)[]>(STARTING_ARMOR);
  const [storage] = useState<(Item | null)[]>(STARTING_STORAGE);
  const [hotbar]  = useState<(Item | null)[]>(STARTING_HOTBAR);
  const [weapon]  = useState<Item | null>(STARTING_WEAPON);

  // Draw player sprite into the inventory preview canvas whenever it opens
  useEffect(() => {
    if (!inventoryOpen) return;
    const ic = inventoryCanvasRef.current;
    const sprites = spritesRef.current;
    if (!ic || !sprites) return;
    const ctx = ic.getContext("2d")!;
    ctx.clearRect(0, 0, ic.width, ic.height);
    // center the sprite in the preview canvas
    const ox = Math.floor((ic.width  - SPRITE_W) / 2);
    const oy = Math.floor((ic.height - SPRITE_H) / 2);
    ctx.drawImage(sprites.down[0], ox, oy);
  }, [inventoryOpen]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    function resize() {
      const el = containerRef.current;
      if (!el) return;
      canvas.width  = el.clientWidth;
      canvas.height = el.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const sprites      = buildSprites();
    spritesRef.current = sprites;

    const keys              = new Set<string>();
    const levelRef          = { current: 0 };
    const flashRef          = { current: 0 };
    const cooldown          = { current: 0 };
    const dirRef            = { current: "down" as Dir };
    const walkTickRef       = { current: 0 };
    const walkFrameRef      = { current: 0 as 0 | 1 };
    const wonRef            = { current: false };
    const deadRef           = { current: false };
    const doorBlockedRef    = { current: 0 };
    const pHpRef            = { current: PLAYER_MAX_HP };
    const pHitCooldown      = { current: 0 };
    const pHitFlash         = { current: 0 };

    const startLevel = LEVELS[0];
    const player = { x: startLevel.spawnX, y: startLevel.spawnY };
    let monsters: MonsterState[] = spawnMonsters(LEVELS[0], 0);

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (["w","a","s","d"].includes(k)) e.preventDefault();
      if (k === "e") {
        e.preventDefault();
        const next = !inventoryOpenRef.current;
        inventoryOpenRef.current = next;
        setInventoryOpen(next);
        return;
      }
      if (k === "escape" && inventoryOpenRef.current) {
        inventoryOpenRef.current = false;
        setInventoryOpen(false);
        return;
      }
      if (k === "1") {
        const next = !equippedRef.current;
        equippedRef.current = next;
        setSwordEquipped(next);
        return;
      }
      if (k === " ") {
        e.preventDefault();
        if (equippedRef.current && swingRef.current === 0) {
          swingRef.current = SWING_FRAMES;
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
      if (wonRef.current || deadRef.current) return;

      const level = LEVELS[levelRef.current];
      const map   = level.map;

      // Freeze movement while inventory is open
      if (!inventoryOpenRef.current) {
        let dx = 0, dy = 0;
        if (keys.has("w")) dy -= SPEED;
        if (keys.has("s")) dy += SPEED;
        if (keys.has("a")) dx -= SPEED;
        if (keys.has("d")) dx += SPEED;

        if (dx !== 0 || dy !== 0) {
          dirRef.current = Math.abs(dx) >= Math.abs(dy)
            ? (dx < 0 ? "left" : "right")
            : (dy < 0 ? "up" : "down");
          if (++walkTickRef.current >= 8) {
            walkTickRef.current = 0;
            walkFrameRef.current = (walkFrameRef.current === 0 ? 1 : 0) as 0 | 1;
          }
        } else {
          walkFrameRef.current = 0;
          walkTickRef.current  = 0;
        }

        if (dx !== 0 && dy !== 0) { dx = Math.round(dx * 0.707); dy = Math.round(dy * 0.707); }
        if (canMoveTo(map, player.x + dx, player.y))      player.x += dx;
        if (canMoveTo(map, player.x,      player.y + dy)) player.y += dy;
      }

      // Door detection (still check even when inventory closed)
      if (!inventoryOpenRef.current) {
        if (cooldown.current > 0) {
          cooldown.current--;
        } else {
          const pcx = player.x + SPRITE_W / 2;
          const pcy = player.y + SPRITE_H / 2;
          const dcx = level.doorTileX * TS + TS / 2;
          const dcy = level.doorTileY * TS + TS / 2;
          if (Math.hypot(pcx - dcx, pcy - dcy) < 22) {
            const allDead = monsters.every(m => m.hp <= 0);
            if (!allDead) {
              doorBlockedRef.current = 120;
            } else {
              const nextLevel = levelRef.current + 1;
              if (nextLevel >= LEVELS.length) {
                wonRef.current = true;
                flashRef.current = 255;
                setWon(true);
              } else {
                levelRef.current = nextLevel;
                const nl = LEVELS[nextLevel];
                player.x = nl.spawnX;
                player.y = nl.spawnY;
                monsters = spawnMonsters(nl, nextLevel);
                flashRef.current = 255;
                cooldown.current = 90;
                setLevelName(nl.name);
              }
            }
          }
        }
      }

      // ── Monster AI ────────────────────────────────────────────────────────
      if (!inventoryOpenRef.current) {
        if (pHitCooldown.current > 0) pHitCooldown.current--;
        if (pHitFlash.current    > 0) pHitFlash.current--;

        const pcx = player.x + SPRITE_W / 2;
        const pcy = player.y + SPRITE_H / 2;

        for (const m of monsters) {
          if (m.hp <= 0) continue;
          m.wobbleTick++;
          if (m.hitCooldown    > 0) m.hitCooldown--;
          if (m.hitFlash       > 0) m.hitFlash--;
          if (m.attackCooldown > 0) m.attackCooldown--;

          const dist = Math.hypot(m.x - pcx, m.y - pcy);

          // Spot player if close enough and no wall in between
          if (!m.aggroed && dist < LOS_RANGE && hasLineOfSight(map, m.x, m.y, pcx, pcy)) {
            m.aggroed = true;
          }

          if (m.aggroed) {
            if (dist <= ATTACK_RANGE) {
              // Melee attack
              m.vx = 0; m.vy = 0;
              if (m.attackCooldown === 0 && pHitCooldown.current === 0) {
                pHpRef.current = Math.max(0, pHpRef.current - m.level * 8);
                setPlayerHp(pHpRef.current);
                pHitCooldown.current = PLAYER_IFRAMES;
                pHitFlash.current    = 14;
                if (pHpRef.current <= 0) {
                  deadRef.current = true;
                  setDead(true);
                }
                m.attackCooldown = ATTACK_CD;
              }
            } else {
              // Chase
              const angle = Math.atan2(pcy - m.y, pcx - m.x);
              m.vx = Math.cos(angle) * CHASE_SPEED;
              m.vy = Math.sin(angle) * CHASE_SPEED;
            }
          } else {
            // Random wander
            m.moveTimer--;
            if (m.moveTimer <= 0) {
              const angle = Math.random() * Math.PI * 2;
              m.vx = Math.cos(angle) * MONSTER_SPEED;
              m.vy = Math.sin(angle) * MONSTER_SPEED;
              m.moveTimer = 80 + Math.floor(Math.random() * 80);
            }
          }

          const nx = m.x + m.vx, ny = m.y + m.vy;
          if (canMonsterMoveTo(map, nx, m.y)) m.x = nx; else { m.vx = 0; if (!m.aggroed) m.moveTimer = 0; }
          if (canMonsterMoveTo(map, m.x, ny)) m.y = ny; else { m.vy = 0; if (!m.aggroed) m.moveTimer = 0; }
        }

        // ── Sword hit detection ──────────────────────────────────────────────
        if (swingRef.current > 0 && equippedRef.current) {
          const t      = 1 - swingRef.current / SWING_FRAMES;
          const tE     = 1 - (1 - t) ** 3;
          const { dx, dy, a } = SWORD_HAND[dirRef.current];
          const hx = player.x + dx;
          const hy = player.y + dy;
          const sweepAngle = a + (tE - 0.5) * SWING_AMP * 2;

          for (const m of monsters) {
            if (m.hp <= 0 || m.hitCooldown > 0) continue;
            if (Math.hypot(m.x - hx, m.y - hy) > BLADE_REACH + MONSTER_RADIUS) continue;
            const toMon = Math.atan2(m.y - hy, m.x - hx);
            if (Math.abs(normalizeAngle(toMon - sweepAngle)) < SWING_AMP) {
              m.hp = Math.max(0, m.hp - 10);
              m.hitCooldown = 30;
              m.hitFlash    = 10;
            }
          }
        }
      }

      // Render
      const W    = canvas.width;
      const H    = canvas.height;
      const camX = player.x + SPRITE_W / 2 - W / 2;
      const camY = player.y + SPRITE_H / 2 - H / 2;

      ctx.clearRect(0, 0, W, H);

      const c0 = Math.max(0, Math.floor(camX / TS));
      const c1 = Math.min(MAP_W, Math.ceil((camX + W) / TS) + 1);
      const r0 = Math.max(0, Math.floor(camY / TS));
      const r1 = Math.min(MAP_H, Math.ceil((camY + H) / TS) + 1);

      for (let r = r0; r < r1; r++) {
        for (let c = c0; c < c1; c++) {
          const tile = map[r][c];
          const sx = Math.round(c * TS - camX);
          const sy = Math.round(r * TS - camY);

          if (tile === 0) {
            ctx.fillStyle = "#c8a45a";
            ctx.fillRect(sx, sy, TS, TS);
            ctx.fillStyle = "rgba(255,220,130,0.35)";
            ctx.fillRect(sx + ((c * 7 + r * 3) % 22) + 2, sy + ((c * 5 + r * 11) % 20) + 2, 2, 2);
            ctx.fillRect(sx + ((c * 13 + r * 7) % 18) + 4, sy + ((c * 9 + r * 4) % 24) + 4, 2, 2);
            ctx.fillStyle = "rgba(0,0,0,0.06)";
            ctx.fillRect(sx, sy, 1, TS);
            ctx.fillRect(sx, sy, TS, 1);
          } else {
            ctx.fillStyle = "#3d2e1e";
            ctx.fillRect(sx, sy, TS, TS);
            ctx.fillStyle = "#2a1f12";
            const off = r % 2 === 0 ? 0 : 16;
            ctx.fillRect(sx, sy + 15, TS, 2);
            ctx.fillRect(sx + off, sy, 2, 15);
            ctx.fillRect(sx + ((off + 16) % TS), sy + 17, 2, 15);
            ctx.fillStyle = "#5a4030";
            ctx.fillRect(sx + 3, sy + 3, 7, 4);
            ctx.fillRect(sx + off + 4, sy + 20, 5, 3);
          }
        }
      }

      const dsx = Math.round(level.doorTileX * TS - camX);
      const dsy = Math.round(level.doorTileY * TS - camY);
      const allDead = monsters.every(m => m.hp <= 0);
      drawDoor(ctx, dsx, dsy, levelRef.current === LEVELS.length - 1, !allDead);

      for (const m of monsters) {
        if (m.hp > 0) drawMonster(ctx, m, camX, camY);
      }

      const sprite = sprites[dirRef.current][walkFrameRef.current];
      const spx = Math.round(player.x - camX);
      const spy = Math.round(player.y - camY);
      ctx.drawImage(sprite, spx, spy);
      if (swingRef.current > 0) swingRef.current--;
      if (equippedRef.current) drawEquippedSword(ctx, spx, spy, dirRef.current, swingRef.current);

      // Red vignette when hit
      if (pHitFlash.current > 0) {
        ctx.save();
        ctx.globalAlpha = (pHitFlash.current / 14) * 0.45;
        ctx.fillStyle = "#cc0000";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 230, 160, ${flashRef.current / 255})`;
        ctx.fillRect(0, 0, W, H);
        flashRef.current = Math.max(0, flashRef.current - 14);
      }

      if (doorBlockedRef.current > 0) {
        const alpha = Math.min(1, doorBlockedRef.current / 30);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 15px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText("DEFEAT ALL MONSTERS FIRST!", W / 2 + 1, H / 2 - 29);
        ctx.fillStyle = "#ff5555";
        ctx.fillText("DEFEAT ALL MONSTERS FIRST!", W / 2, H / 2 - 30);
        ctx.restore();
        doorBlockedRef.current--;
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

  // Preview canvas size (sprite drawn at 1:1, displayed at 3× via CSS)
  const PREVIEW_CSS = SPRITE_W * 3;
  const PREVIEW_CSS_H = SPRITE_H * 3;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm border-b border-white/10 font-mono text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-yellow-300 font-bold tracking-widest">VOID EXPLORER</span>
          <div className="flex items-center gap-0.5" title={`${playerHp} / ${PLAYER_MAX_HP} HP`}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} style={{
                fontSize: 13,
                lineHeight: 1,
                color: i < Math.ceil(playerHp / 10) ? (playerHp <= 20 ? "#ff2222" : "#ff5555") : "#3a1a1a",
                textShadow: i < Math.ceil(playerHp / 10) ? "0 0 4px #ff0000" : "none",
              }}>♥</span>
            ))}
          </div>
        </div>
        <span className="text-yellow-200 tracking-widest">{levelName} / {LEVELS.length}</span>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 tracking-widest">[E] INV &nbsp; [1] {swordEquipped ? <span className="text-green-400">SWORD ✓</span> : "EQUIP"}</span>
          <Link href="/games/explorer" className="hover:text-white transition-colors tracking-widest">
            ← MENU
          </Link>
        </div>
      </div>

      {/* Game canvas */}
      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        <canvas ref={canvasRef} style={{ display: "block", imageRendering: "pixelated" }} />

        {/* Inventory overlay */}
        {inventoryOpen && !won && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 10 }}
            onClick={(ev) => {
              if (ev.target === ev.currentTarget) {
                inventoryOpenRef.current = false;
                setInventoryOpen(false);
              }
            }}
          >
            <div style={PANEL_STYLE}>
              {/* ── Top section: armor / player / crafting ── */}
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>

                {/* Armor slots */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {armor.map((item, i) => (
                    <Slot key={i} item={item} />
                  ))}
                </div>

                {/* Player preview */}
                <div style={{
                  width: PREVIEW_CSS + 16,
                  height: PREVIEW_CSS_H + 12,
                  background: "#8B8B8B",
                  boxShadow: "inset -2px -2px 0 #fff, inset 2px 2px 0 #373737",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 2,
                  marginRight: 2,
                }}>
                  <canvas
                    ref={inventoryCanvasRef}
                    width={SPRITE_W}
                    height={SPRITE_H}
                    style={{
                      imageRendering: "pixelated",
                      width: PREVIEW_CSS,
                      height: PREVIEW_CSS_H,
                    }}
                  />
                </div>

                {/* Equipped weapon */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={LABEL}>Weapon  [1]</span>
                  <Slot item={weapon} equipped={swordEquipped} />
                </div>
              </div>

              {/* ── Storage grid 9×3 ── */}
              <span style={LABEL}>Inventory</span>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(9, ${SLOT}px)`, gap: 2, marginBottom: 6 }}>
                {storage.map((item, i) => <Slot key={i} item={item} />)}
              </div>

              {/* ── Hotbar 9×1 ── */}
              <div style={{ display: "grid", gridTemplateColumns: `repeat(9, ${SLOT}px)`, gap: 2, borderTop: "2px solid #999", paddingTop: 6 }}>
                {hotbar.map((item, i) => <Slot key={i} item={item} />)}
              </div>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <p className="font-mono text-red-500 tracking-[0.4em] text-sm mb-4">✦ YOU WERE DEFEATED ✦</p>
            <h2
              className="text-5xl font-bold font-mono text-red-400 mb-8 tracking-widest"
              style={{ textShadow: "0 0 30px rgba(220,0,0,0.6)" }}
            >
              GAME OVER
            </h2>
            <Link
              href="/games/explorer"
              className="font-mono tracking-[0.3em] text-white border border-white/30 px-8 py-3 hover:bg-white/10 transition-colors"
            >
              TRY AGAIN
            </Link>
          </div>
        )}

        {/* Win overlay */}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75">
            <p className="font-mono text-sky-400 tracking-[0.4em] text-sm mb-4">✦ ALL MAZES CLEARED ✦</p>
            <h2
              className="text-5xl font-bold font-mono text-yellow-300 mb-8 tracking-widest"
              style={{ textShadow: "0 0 30px rgba(253,224,71,0.5)" }}
            >
              YOU WIN!
            </h2>
            <Link
              href="/games/explorer"
              className="font-mono tracking-[0.3em] text-white border border-white/30 px-8 py-3 hover:bg-white/10 transition-colors"
            >
              PLAY AGAIN
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
