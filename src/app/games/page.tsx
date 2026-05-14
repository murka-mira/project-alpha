import Link from "next/link";

const games = [
  {
    title: "Clicker",
    description: "Click to earn points and buy upgrades.",
    href: "/games/clicker",
    emoji: "👆",
    madeBy: "Dylan",
  },
  {
    title: "Void Explorer",
    description: "A retro top-down adventure game.",
    href: "/games/explorer",
    emoji: "🗡️",
    madeBy: "Dylan",
  },
];

export default function Games() {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-1">Games</h1>
      <p className="text-slate-400 mb-10">Pick a game to play.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Link
            key={game.title}
            href={game.href}
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-500/40 hover:bg-white/10 transition-all"
          >
            <span className="text-3xl">{game.emoji}</span>
            <h2 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
              {game.title}
            </h2>
            <p className="text-sm text-slate-400">{game.description}</p>
            <p className="text-xs text-slate-500 mt-auto pt-3 border-t border-white/10">
              Made by {game.madeBy}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
