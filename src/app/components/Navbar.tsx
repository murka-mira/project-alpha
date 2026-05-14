import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-sky-400">
          Dylan's Void
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/games" className="hover:text-white transition-colors">Games</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
}
