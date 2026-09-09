// The wave is the actual color boundary between the section above and the
// section this divider sits inside of (`to`), not just a squiggle floating
// on top of a hard-edged color cut. The region above the wave line is
// painted `from` so it seamlessly matches the preceding section's flat
// background; only below the wave does it become `to`.
export function WaveDivider({
  flip = false,
  from = "#ffffff",
  to = "var(--mist)",
  className = "absolute inset-x-0 top-0",
}: {
  flip?: boolean;
  from?: string;
  to?: string;
  className?: string;
}) {
  const wave = flip
    ? "M0,56 Q120,86 240,56 T480,56 T720,56 T960,56 T1200,56 T1440,56"
    : "M0,56 Q120,26 240,56 T480,56 T720,56 T960,56 T1200,56 T1440,56";
  const waveDetail = flip
    ? "M0,68 Q120,88 240,68 T480,68 T720,68 T960,68 T1200,68 T1440,68"
    : "M0,68 Q120,48 240,68 T480,68 T720,68 T960,68 T1200,68 T1440,68";

  return (
    <div
      aria-hidden
      className={`pointer-events-none h-16 w-full overflow-hidden sm:h-24 ${className}`}
    >
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path d={`${wave} L1440,0 L0,0 Z`} fill={from} />
        <path d={`${wave} L1440,128 L0,128 Z`} fill={to} />
        <path
          d={wave}
          fill="none"
          stroke="#4bd8e6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d={waveDetail}
          fill="none"
          stroke="#1c86c9"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
      <span className="absolute left-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-aqua/40" />
      <span className="absolute left-[52%] top-[55%] h-1 w-1 rounded-full bg-ocean/40" />
      <span className="absolute left-[78%] top-[22%] h-2 w-2 rounded-full border border-aqua/40" />
    </div>
  );
}

export function CornerBubbles({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute h-40 w-40 ${className}`}
    >
      <div className="absolute inset-0 m-auto h-28 w-28 rounded-full bg-aqua/10 blur-3xl" />
      <span className="absolute left-6 top-10 h-3 w-3 rounded-full border-[1.5px] border-ocean/25" />
      <span className="absolute left-16 top-2 h-2 w-2 rounded-full bg-aqua/20" />
      <span className="absolute left-2 top-24 h-1.5 w-1.5 rounded-full bg-ocean/25" />
    </div>
  );
}
