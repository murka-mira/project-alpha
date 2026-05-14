import Link from "next/link";

export default function Play() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono text-slate-400 tracking-widest text-sm mb-4">VOID EXPLORER</p>
      <h1 className="font-mono text-3xl text-white tracking-widest mb-8">GAME COMING SOON</h1>
      <Link
        href="/games/explorer"
        className="font-mono text-slate-500 text-sm hover:text-slate-300 transition-colors tracking-widest"
      >
        ← BACK TO TITLE
      </Link>
    </main>
  );
}
