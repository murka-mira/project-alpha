import WaveformMark from "./WaveformMark";

export default function Footer() {
  return (
    <footer className="bg-navy py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <a href="#top" className="flex items-center gap-2">
          <WaveformMark className="h-8 w-8 shrink-0 ring-1 ring-white/10" />
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
