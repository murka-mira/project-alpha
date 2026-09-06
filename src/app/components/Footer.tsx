export default function Footer() {
  return (
    <footer className="bg-navy py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-aqua">
            <svg viewBox="0 0 24 24" className="h-6 w-6">
              <defs>
                <linearGradient id="footerLogoGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#d7fbff" />
                </linearGradient>
              </defs>
              <path
                d="M2,15 C5,6 9,6 12,11 C15,16 19,16 22,8 L22,11 C19,19 15,19 12,14 C9,9 5,9 2,18 Z"
                fill="url(#footerLogoGrad)"
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
