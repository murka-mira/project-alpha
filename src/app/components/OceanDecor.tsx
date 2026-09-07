export function WaveDivider({
  flip = false,
  className = "relative",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`h-10 w-full overflow-hidden sm:h-14 ${className}`}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={`h-full w-full ${flip ? "-scale-y-100" : ""}`}
      >
        <path
          d="M0,32 Q120,12 240,32 T480,32 T720,32 T960,32 T1200,32 T1440,32"
          fill="none"
          stroke="#4bd8e6"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M0,42 Q120,26 240,42 T480,42 T720,42 T960,42 T1200,42 T1440,42"
          fill="none"
          stroke="#1c86c9"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
      <span className="absolute left-[18%] top-1 h-1.5 w-1.5 rounded-full bg-aqua/40" />
      <span className="absolute left-[52%] top-4 h-1 w-1 rounded-full bg-ocean/40" />
      <span className="absolute left-[78%] top-0 h-2 w-2 rounded-full border border-aqua/40" />
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
