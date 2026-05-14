import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 py-32 text-center">
      <div className="mb-6 inline-block rounded-full bg-sky-500/20 border border-sky-500/30 px-4 py-1.5 text-sm font-medium text-sky-400">
        Personal Space
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
        Welcome to <span className="text-sky-400">Dylan's Void</span>
      </h1>
      <p className="text-lg text-slate-400 max-w-md mb-10">
        A personal space for games, tools, and whatever else comes next.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-400 transition-colors shadow-lg shadow-sky-900/40"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/games"
          className="px-6 py-3 rounded-full border border-white/20 text-slate-300 font-medium hover:bg-white/10 hover:text-white transition-colors"
        >
          Play Games
        </Link>
        <Link
          href="/about"
          className="px-6 py-3 rounded-full border border-white/20 text-slate-300 font-medium hover:bg-white/10 hover:text-white transition-colors"
        >
          About the Void
        </Link>
      </div>
    </main>
  );
}
