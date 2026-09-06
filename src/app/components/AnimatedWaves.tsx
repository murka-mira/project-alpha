type Layer = {
  path: string;
  gradientId: string;
  from: string;
  to: string;
  opacity: number;
  duration: string;
  heightClass: string;
  reverse?: boolean;
};

const layers: Layer[] = [
  {
    path: "M0,120 C120,60 240,180 360,120 C480,60 600,180 720,120 C840,60 960,180 1080,120 C1200,60 1320,180 1440,120 L1440,320 L0,320 Z",
    gradientId: "waveBack",
    from: "#0b1f38",
    to: "#1364a3",
    opacity: 0.55,
    duration: "28s",
    heightClass: "h-44 sm:h-64",
  },
  {
    path: "M0,150 C160,90 320,210 480,150 C640,90 800,210 960,150 C1120,90 1280,210 1440,150 L1440,320 L0,320 Z",
    gradientId: "waveMid",
    from: "#1364a3",
    to: "#4bd8e6",
    opacity: 0.45,
    duration: "20s",
    heightClass: "h-36 sm:h-52",
    reverse: true,
  },
  {
    path: "M0,180 C180,140 360,220 540,180 C720,140 900,220 1080,180 C1260,140 1440,220 1440,180 L1440,320 L0,320 Z",
    gradientId: "waveFront",
    from: "#4bd8e6",
    to: "#8be9c8",
    opacity: 0.3,
    duration: "15s",
    heightClass: "h-28 sm:h-40",
  },
];

export default function AnimatedWaves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-64 sm:h-80">
      {layers.map((layer) => (
        <div
          key={layer.gradientId}
          className={`absolute inset-x-0 bottom-0 ${layer.heightClass}`}
          style={{ opacity: layer.opacity }}
        >
          <div
            className="animate-wave-loop flex h-full w-[200%]"
            style={{
              animationDuration: layer.duration,
              animationDirection: layer.reverse ? "reverse" : "normal",
            }}
          >
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="h-full w-1/2"
              >
                <defs>
                  <linearGradient
                    id={`${layer.gradientId}-${copy}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={layer.from} />
                    <stop offset="100%" stopColor={layer.to} />
                  </linearGradient>
                </defs>
                <path
                  d={layer.path}
                  fill={`url(#${layer.gradientId}-${copy})`}
                />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
