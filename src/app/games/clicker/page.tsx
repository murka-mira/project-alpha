"use client";

import { useState, useEffect, useRef } from "react";

type Upgrade = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  pointsPerSecond: number;
  count: number;
  emoji: string;
};

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: "cursor",
    name: "Auto Cursor",
    description: "Clicks for you once per second.",
    baseCost: 10,
    pointsPerSecond: 1,
    count: 0,
    emoji: "🖱️",
  },
  {
    id: "robot",
    name: "Click Robot",
    description: "A robot that clicks 5x per second.",
    baseCost: 75,
    pointsPerSecond: 5,
    count: 0,
    emoji: "🤖",
  },
  {
    id: "factory",
    name: "Click Factory",
    description: "Produces 20 points per second.",
    baseCost: 500,
    pointsPerSecond: 20,
    count: 0,
    emoji: "🏭",
  },
  {
    id: "lab",
    name: "Research Lab",
    description: "Generates 100 points per second.",
    baseCost: 3000,
    pointsPerSecond: 100,
    count: 0,
    emoji: "🔬",
  },
];

function getCost(upgrade: Upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));
}

function UpgradeList({
  upgrades,
  points,
  onBuy,
}: {
  upgrades: Upgrade[];
  points: number;
  onBuy: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {upgrades.map((upgrade) => {
        const cost = getCost(upgrade);
        const canAfford = points >= cost;
        return (
          <button
            key={upgrade.id}
            onClick={() => onBuy(upgrade.id)}
            disabled={!canAfford}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
              canAfford
                ? "border-white/20 bg-white/5 backdrop-blur-sm hover:border-sky-500/50 hover:bg-white/10 cursor-pointer"
                : "border-white/5 bg-white/5 opacity-40 cursor-not-allowed"
            }`}
          >
            <span className="text-2xl">{upgrade.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">{upgrade.name}</span>
                <span className="text-sm font-medium text-sky-400 whitespace-nowrap">
                  {cost.toLocaleString()} pts
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{upgrade.description}</p>
            </div>
            {upgrade.count > 0 && (
              <span className="ml-2 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold px-2 py-0.5">
                {upgrade.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Clicker() {
  const [points, setPoints] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [clickEffect, setClickEffect] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const particleId = useRef(0);

  const pointsPerSecond = upgrades.reduce(
    (sum, u) => sum + u.pointsPerSecond * u.count,
    0
  );

  useEffect(() => {
    if (pointsPerSecond === 0 || paused) return;
    const interval = setInterval(() => {
      setPoints((p) => p + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [pointsPerSecond, paused]);

  useEffect(() => {
    function onFullscreenChange() {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs) setShopOpen(false);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!isFullscreen) {
      gameRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function handleClick() {
    if (paused) return;
    setPoints((p) => p + 1);
    setTotalClicks((c) => c + 1);
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 100);

    const id = particleId.current++;
    const x = Math.random() * 90 + 5;
    setParticles((prev) => [...prev, { id, x }]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 1800);
  }

  function buyUpgrade(id: string) {
    const upgrade = upgrades.find((u) => u.id === id);
    if (!upgrade) return;
    const cost = getCost(upgrade);
    if (points < cost) return;
    setPoints((p) => p - cost);
    setUpgrades((prev) =>
      prev.map((u) => (u.id === id ? { ...u, count: u.count + 1 } : u))
    );
  }

  return (
    <main className="flex-1 relative">

      <div className="relative max-w-5xl mx-auto w-full px-6 py-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Clicker</h1>
            <p className="text-slate-400">Click to earn points. Buy upgrades to earn more.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaused((p) => !p)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                paused
                  ? "bg-sky-500 text-white hover:bg-sky-400"
                  : "border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-5 py-2 rounded-full text-sm font-medium border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              ⛶ Fullscreen
            </button>
          </div>
        </div>

        {/* Normal layout */}
        <div
          ref={gameRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          style={
            isFullscreen
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  background: "radial-gradient(ellipse at 50% 0%, #1a2a4a 0%, #0a0f1e 50%, #000008 100%)",
                }
              : {}
          }
        >
          {/* Click area */}
          <div
            className={`flex flex-col items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm ${
              isFullscreen ? "p-16 w-[480px]" : "p-10"
            }`}
          >
            <div className="text-center">
              <div className={`font-bold text-white ${isFullscreen ? "text-6xl" : "text-5xl"}`}>
                {points.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm mt-1">points</div>
            </div>

            <div className="text-sm text-slate-400">
              {pointsPerSecond > 0 && (
                <span className="text-sky-400 font-medium">+{pointsPerSecond}/sec · </span>
              )}
              {totalClicks.toLocaleString()} total clicks
            </div>

            <button
              onClick={handleClick}
              disabled={paused}
              className={`rounded-full text-white text-5xl shadow-lg transition-all ${
                isFullscreen ? "w-48 h-48" : "w-36 h-36"
              } ${
                paused
                  ? "bg-white/20 shadow-none cursor-not-allowed"
                  : "bg-sky-500 shadow-sky-900/40 active:scale-95 hover:bg-sky-400"
              } ${clickEffect ? "scale-95" : "scale-100"}`}
            >
              {paused ? "⏸" : "👆"}
            </button>

            <p className="text-xs text-slate-400">{paused ? "Game paused" : "Click the button!"}</p>

            {/* Shop button — only in fullscreen */}
            {isFullscreen && (
              <button
                onClick={() => setShopOpen(true)}
                className="mt-2 px-8 py-3 rounded-full bg-sky-500 text-white font-medium text-sm hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200"
              >
                🛒 Open Shop
              </button>
            )}
          </div>

          {/* Upgrades — normal layout only */}
          {!isFullscreen && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-white">Upgrades</h2>
              <UpgradeList upgrades={upgrades} points={points} onBuy={buyUpgrade} />
            </div>
          )}

          {/* Shop overlay — fullscreen only */}
          {isFullscreen && shopOpen && (
            <div
              className="absolute inset-0 flex items-center justify-center z-50"
              style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setShopOpen(false)}
            >
              <div
                className="bg-slate-900/90 border border-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Shop</h2>
                  <button
                    onClick={() => setShopOpen(false)}
                    className="text-slate-400 hover:text-white text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm text-sky-500 font-medium mb-4">
                  {points.toLocaleString()} points available
                </div>
                <UpgradeList upgrades={upgrades} points={points} onBuy={buyUpgrade} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Explosion particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="fixed text-3xl pointer-events-none select-none"
          style={{
            left: `${p.x}%`,
            bottom: "0",
            animation: "float-up 1.8s ease-out forwards",
            zIndex: 9999,
          }}
        >
          💥
        </span>
      ))}
    </main>
  );
}
