"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Color palette
const C: Record<string, string | null> = {
  ".": null,
  G: "#2d6a4f",   // dark green (hat outline)
  g: "#40916c",   // medium green (hat fill)
  H: "#e9c46a",   // blonde hair
  S: "#fddcb4",   // skin
  e: "#1a1a2e",   // eyes
  M: "#c9736a",   // mouth
  T: "#52b788",   // tunic
  B: "#8b5e3c",   // boots
};

// 12 wide x 14 tall pixel sprite (Link-like character, facing down)
const SPRITE = [
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

const PX = 9; // pixel scale

export default function Explorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blink, setBlink] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 550);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") router.push("/games/explorer/play");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    SPRITE.forEach((row, y) => {
      [...row].forEach((char, x) => {
        const color = C[char];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(x * PX, y * PX, PX, PX);
      });
    });
  }, []);

  const W = 12 * PX;
  const H = 14 * PX;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

      {/* Title */}
      <p
        className="text-sm tracking-[0.4em] text-sky-400 mb-3 font-mono"
      >
        ✦ A NEW ADVENTURE ✦
      </p>
      <h1
        className="text-6xl font-bold tracking-widest text-yellow-300 mb-14 font-mono"
        style={{ textShadow: "0 0 30px rgba(253,224,71,0.4), 0 0 60px rgba(253,224,71,0.15)" }}
      >
        VOID
        <br />
        EXPLORER
      </h1>

      {/* Character with glow */}
      <div className="relative mb-14">
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(82,183,136,0.25) 0%, transparent 65%)",
            transform: "scale(2.5)",
          }}
        />
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Blinking press enter */}
      <Link
        href="/games/explorer/play"
        className="font-mono tracking-[0.3em] text-lg text-white border border-white/25 px-10 py-3 mb-10 hover:bg-white/10 transition-colors"
        style={{
          opacity: blink ? 1 : 0,
          transition: "opacity 0.1s",
          boxShadow: "0 0 15px rgba(255,255,255,0.05)",
        }}
      >
        — PRESS ENTER —
      </Link>

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/games/explorer/play"
          className="font-mono tracking-[0.2em] text-sm text-slate-400 border border-white/15 px-8 py-2 hover:bg-white/5 hover:text-white transition-colors"
        >
          SKIP TUTORIAL →
        </Link>
        <Link
          href="/games/explorer/tutorial"
          className="font-mono tracking-[0.2em] text-xs text-sky-400 hover:text-sky-300 transition-colors"
        >
          ? HOW TO PLAY
        </Link>
      </div>

      <Link
        href="/games"
        className="text-slate-500 font-mono text-sm hover:text-slate-300 transition-colors tracking-widest"
      >
        ← BACK TO GAMES
      </Link>
    </main>
  );
}
