export default function Footer() {
  return (
    <footer className="bg-navy py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-ocean via-aqua to-green">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white">
              <path
                d="M2 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold text-white">
            Waveform Web
          </span>
        </a>
        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} Waveform Web. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
