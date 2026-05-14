import Link from "next/link";

const sections = [
  {
    title: "Games",
    description: "Play games built right here in the app.",
    href: "/games",
    emoji: "🎮",
    external: false,
  },
  {
    title: "Aries Student Portal",
    description: "Log in to the IUSD student portal.",
    href: "https://my.iusd.org/LoginParent.aspx",
    emoji: "🎓",
    external: true,
  },
  {
    title: "Canvas",
    description: "Access your IUSD Canvas courses and assignments.",
    href: "https://iusd.instructure.com",
    emoji: "📚",
    external: true,
  },
  {
    title: "More Coming Soon",
    description: "New sections will show up here as you build them.",
    href: "#",
    emoji: "🚧",
    external: false,
  },
];

export default function Dashboard() {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-slate-400 mb-10">Your hub for everything in the app.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            target={section.external ? "_blank" : undefined}
            rel={section.external ? "noopener noreferrer" : undefined}
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-500/40 hover:bg-white/10 transition-all"
          >
            <span className="text-3xl">{section.emoji}</span>
            <h2 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
              {section.title}
            </h2>
            <p className="text-sm text-slate-400">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
