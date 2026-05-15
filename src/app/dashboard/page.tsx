import Link from "next/link";

const featured = [
  {
    title: "Aries Student Portal",
    description: "Log in to the IUSD student portal.",
    href: "https://my.iusd.org/LoginParent.aspx",
  },
  {
    title: "Canvas",
    description: "Access your IUSD Canvas courses and assignments.",
    href: "https://iusd.instructure.com",
  },
];

const rest = [
  {
    title: "More Coming Soon",
    description: "New sections will show up here as you build them.",
    href: "#",
    external: false,
  },
];

export default function Dashboard() {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-slate-400 mb-10">Your hub for everything in the app.</p>

      {/* Featured row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {featured.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-500/40 hover:bg-white/10 transition-all"
          >
            <h2 className="text-2xl font-bold text-white group-hover:text-sky-400 transition-colors">
              {s.title}
            </h2>
            <p className="text-base text-slate-400">{s.description}</p>
          </Link>
        ))}
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            target={s.external ? "_blank" : undefined}
            rel={s.external ? "noopener noreferrer" : undefined}
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-500/40 hover:bg-white/10 transition-all"
          >
            <h2 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
              {s.title}
            </h2>
            <p className="text-sm text-slate-400">{s.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
