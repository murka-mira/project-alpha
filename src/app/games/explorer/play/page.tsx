"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Sprite ────────────────────────────────────────────────────────────────────
const SPRITE_MAP = [
  "..gggggg....",
  ".gggggggg...",
  ".GHHHHHHHG..",
  ".GSSSSSSSG..",
  ".GSeSSSeSG..",
  ".GSSSSSSSG..",
  ".GSSSMMSSG..",
  "TTTTTTTTTTTT",
  ".TTTTTTTTTT.",
  ".TTTTTTTTTT.",
  "..BBTTTBB...",
  "..BBTTTBB...",
  "..BB...BB...",
  "..BB...BB...",
];
const SC: Record<string, string | null> = {
  ".": null, G: "#2d6a4f", g: "#40916c",
  H: "#e9c46a", S: "#fddcb4", e: "#1a1a2e",
  M: "#c9736a", T: "#52b788", B: "#8b5e3c",
};
const SPX = 3;
const SPRITE_W = 12 * SPX;
const SPRITE_H = 14 * SPX;

function buildSprite() {
  const c = document.createElement("canvas");
  c.width = SPRITE_W; c.height = SPRITE_H;
  const ctx = c.getContext("2d")!;
  SPRITE_MAP.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const col = SC[ch]; if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(x * SPX, y * SPX, SPX, SPX);
    })
  );
  return c;
}

// ── Tiles ─────────────────────────────────────────────────────────────────────
const TILE = { GRASS: 0, DIRT: 1, ROCK: 2, WATER: 3 } as const;
const TS = 32;
const TILE_COLOR: Record<number, string> = {
  0: "#c8a45a", 1: "#a07840", 2: "#8c6a28", 3: "#1a7f9e",
};

// ── Maps ──────────────────────────────────────────────────────────────────────
// 0=sand  1=cracked path  2=rock/cactus  3=oasis
const MAP_0: number[][] = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,2,2,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,2,2,0,0,1,1,1,1,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,2],
  [2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,2],
  [2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,2],
  [2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const MAP_1: number[][] = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,2,2,2,0,0,0,2,0,0,2,2,0,0,0,2,2,2,0,0,0,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2],
  [2,0,2,2,2,2,2,0,0,2,0,0,2,2,0,0,0,2,2,2,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2],
  [2,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,2,2,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,2,3,2,0,0,0,2,3,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,2,3,2,0,0,0,2,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,2],
  [2,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const MAP_2: number[][] = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,2],
  [2,0,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,0,0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0,2,2,2,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,2],
  [2,0,3,3,0,0,0,2,2,0,0,0,0,2,2,0,0,0,3,3,0,0,0,2,2,0,0,0,2,2,0,0,3,3,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,0,0,2,2,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,2,2,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,2,2,0,0,0,0,3,3,3,3,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,2,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,2],
  [2,0,2,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,2,2,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,2],
  [2,0,0,2,2,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// ── Doors ─────────────────────────────────────────────────────────────────────
type Door = { tileX: number; tileY: number; toLevel: number; spawnX: number; spawnY: number; label: string };

const LEVELS = [
  {
    name: "LEVEL 1", map: MAP_0,
    doors: [
      { tileX: 37, tileY: 14, toLevel: 1, spawnX: 3 * TS, spawnY: 14 * TS, label: "LVL 2 ▶" },
    ] as Door[],
  },
  {
    name: "LEVEL 2", map: MAP_1,
    doors: [
      { tileX: 2,  tileY: 14, toLevel: 0, spawnX: 36 * TS, spawnY: 14 * TS, label: "◀ LVL 1" },
      { tileX: 37, tileY: 14, toLevel: 2, spawnX: 3  * TS, spawnY: 14 * TS, label: "LVL 3 ▶" },
    ] as Door[],
  },
  {
    name: "LEVEL 3", map: MAP_2,
    doors: [
      { tileX: 2,  tileY: 14, toLevel: 1, spawnX: 36 * TS, spawnY: 14 * TS, label: "◀ LVL 2" },
    ] as Door[],
  },
];

const MAP_W = 40, MAP_H = 30, SPEED = 2;

function isSolid(map: number[][], tx: number, ty: number) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  const t = map[ty][tx];
  return t === TILE.ROCK || t === TILE.WATER;
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

function drawDoor(ctx: CanvasRenderingContext2D, sx: number, sy: number, label: string) {
  // Stone pillars
  ctx.fillStyle = "#5c3a14";
  ctx.fillRect(sx - 3, sy + 4, 5, 30);
  ctx.fillRect(sx + 30, sy + 4, 5, 30);
  // Arch top
  ctx.fillRect(sx - 3, sy, 38, 6);
  // Pillar highlight
  ctx.fillStyle = "#9e6e30";
  ctx.fillRect(sx - 2, sy + 5, 2, 20);
  ctx.fillRect(sx + 32, sy + 5, 2, 20);
  // Portal interior
  ctx.fillStyle = "#080318";
  ctx.fillRect(sx + 2, sy + 6, 28, 26);
  // Portal glow lines
  ctx.fillStyle = "rgba(255, 190, 40, 0.7)";
  ctx.fillRect(sx + 2, sy + 6, 28, 3);
  ctx.fillStyle = "rgba(255, 190, 40, 0.3)";
  ctx.fillRect(sx + 2, sy + 9, 28, 3);
  // Stars inside portal
  ctx.fillStyle = "rgba(255,255,200,0.6)";
  ctx.fillRect(sx + 8,  sy + 14, 2, 2);
  ctx.fillRect(sx + 18, sy + 18, 2, 2);
  ctx.fillRect(sx + 24, sy + 12, 2, 2);
  // Label
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  ctx.fillText(label, sx + 16, sy + 38);
  ctx.textAlign = "left";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Play() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [levelName, setLevelName] = useState("LEVEL 1");

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

    const sprite   = buildSprite();
    const keys     = new Set<string>();
    const player   = { x: 5 * TS, y: 5 * TS };
    const levelRef = { current: 0 };
    const flashRef = { current: 0 };     // 0–255
    const cooldown = { current: 0 };     // frames before door re-triggers

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (["w","a","s","d"].includes(k)) e.preventDefault();
      keys.add(k);
    }
    function onKeyUp(e: KeyboardEvent) { keys.delete(e.key.toLowerCase()); }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);

    let animId: number;

    function loop() {
      const level = LEVELS[levelRef.current];
      const map   = level.map;

      // ── Movement ──────────────────────────────────────────────────────────
      let dx = 0, dy = 0;
      if (keys.has("w")) dy -= SPEED;
      if (keys.has("s")) dy += SPEED;
      if (keys.has("a")) dx -= SPEED;
      if (keys.has("d")) dx += SPEED;
      if (dx !== 0 && dy !== 0) { dx = Math.round(dx * 0.707); dy = Math.round(dy * 0.707); }
      if (canMoveTo(map, player.x + dx, player.y))      player.x += dx;
      if (canMoveTo(map, player.x,      player.y + dy)) player.y += dy;

      // ── Door detection ────────────────────────────────────────────────────
      if (cooldown.current > 0) {
        cooldown.current--;
      } else {
        const pcx = player.x + SPRITE_W / 2;
        const pcy = player.y + SPRITE_H / 2;
        for (const door of level.doors) {
          const dcx = door.tileX * TS + TS / 2;
          const dcy = door.tileY * TS + TS / 2;
          if (Math.hypot(pcx - dcx, pcy - dcy) < 22) {
            levelRef.current   = door.toLevel;
            player.x           = door.spawnX;
            player.y           = door.spawnY;
            flashRef.current   = 255;
            cooldown.current   = 90;
            setLevelName(LEVELS[door.toLevel].name);
            break;
          }
        }
      }

      // ── Render ────────────────────────────────────────────────────────────
      const W    = canvas.width;
      const H    = canvas.height;
      const camX = player.x + SPRITE_W / 2 - W / 2;
      const camY = player.y + SPRITE_H / 2 - H / 2;

      ctx.clearRect(0, 0, W, H);

      const c0 = Math.max(0, Math.floor(camX / TS));
      const c1 = Math.min(MAP_W, Math.ceil((camX + W) / TS) + 1);
      const r0 = Math.max(0, Math.floor(camY / TS));
      const r1 = Math.min(MAP_H, Math.ceil((camY + H) / TS) + 1);

      // Tiles
      for (let r = r0; r < r1; r++) {
        for (let c = c0; c < c1; c++) {
          const tile = map[r][c];
          const sx = Math.round(c * TS - camX);
          const sy = Math.round(r * TS - camY);

          ctx.fillStyle = TILE_COLOR[tile] ?? TILE_COLOR[0];
          ctx.fillRect(sx, sy, TS, TS);

          if (tile === TILE.GRASS) {
            ctx.fillStyle = "rgba(255,220,130,0.35)";
            ctx.fillRect(sx + ((c * 7 + r * 3) % 22) + 2, sy + ((c * 5 + r * 11) % 20) + 2, 2, 2);
            ctx.fillRect(sx + ((c * 13 + r * 7) % 18) + 4, sy + ((c * 9 + r * 4) % 24) + 4, 2, 2);
            ctx.fillStyle = "rgba(0,0,0,0.07)";
            ctx.fillRect(sx, sy, 1, TS); ctx.fillRect(sx, sy, TS, 1);
          }
          if (tile === TILE.DIRT) {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fillRect(sx + 6, sy + 10, 12, 1); ctx.fillRect(sx + 16, sy + 18, 10, 1);
            ctx.fillRect(sx + 8, sy + 22, 8, 1);  ctx.fillRect(sx + 14, sy + 10, 1, 10);
            ctx.fillStyle = "rgba(255,200,100,0.2)";
            ctx.fillRect(sx + 7, sy + 9, 12, 1);
          }
          if (tile === TILE.ROCK) {
            ctx.fillStyle = "#6b4e18";
            ctx.fillRect(sx + 4, sy + 4, TS - 8, TS - 8);
            ctx.fillStyle = "#b89040";
            ctx.fillRect(sx + 5, sy + 5, 6, 4);
            ctx.fillStyle = "#3a7d44";
            ctx.fillRect(sx + 13, sy + 8, 6, 18);
            ctx.fillRect(sx + 7, sy + 14, 6, 4); ctx.fillRect(sx + 7, sy + 10, 4, 4);
            ctx.fillRect(sx + 19, sy + 16, 6, 4); ctx.fillRect(sx + 21, sy + 12, 4, 4);
            ctx.fillRect(sx + 14, sy + 6, 4, 3);
          }
          if (tile === TILE.WATER) {
            ctx.fillStyle = "rgba(120,220,255,0.2)";
            ctx.fillRect(sx + 3, sy + 6, TS - 6, 3);
            ctx.fillRect(sx + 3, sy + 18, TS - 6, 3);
            ctx.fillStyle = "rgba(255,255,255,0.1)";
            ctx.fillRect(sx + 6, sy + 8, 8, 2);
          }
        }
      }

      // Doors
      for (const door of level.doors) {
        const sx = Math.round(door.tileX * TS - camX);
        const sy = Math.round(door.tileY * TS - camY);
        drawDoor(ctx, sx, sy, door.label);
      }

      // Player
      ctx.drawImage(sprite, Math.round(player.x - camX), Math.round(player.y - camY));

      // Transition flash
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 230, 160, ${flashRef.current / 255})`;
        ctx.fillRect(0, 0, W, H);
        flashRef.current = Math.max(0, flashRef.current - 14);
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm border-b border-white/10 font-mono text-xs text-slate-400 shrink-0">
        <span className="text-yellow-300 font-bold tracking-widest">VOID EXPLORER</span>
        <span className="text-yellow-200 tracking-widest">{levelName}</span>
        <Link href="/games/explorer" className="hover:text-white transition-colors tracking-widest">
          ← MENU
        </Link>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden">
        <canvas ref={canvasRef} style={{ display: "block", imageRendering: "pixelated" }} />
      </div>
    </div>
  );
}
