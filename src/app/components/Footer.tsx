export default function Footer() {
  return (
    <footer className="bg-navy py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-3 ring-1 ring-white/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-aqua-2">
              <path
                d="M2 16c2-6 6-9 9-9 3.5 0 4.5 3.5 4 6.5-.3 2-2 3-3.5 2.3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
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
