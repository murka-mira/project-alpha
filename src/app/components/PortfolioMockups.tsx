type MockupProps = { accent: string };

function Bar({
  width,
  color,
  opacity = 1,
  height = "h-2",
}: {
  width: string;
  color: string;
  opacity?: number;
  height?: string;
}) {
  return (
    <div
      className={`rounded-full ${height} ${width}`}
      style={{ background: color, opacity }}
    />
  );
}

export function RestaurantMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color={accent} opacity={0.55} />
        <div className="flex gap-2.5">
          <Bar width="w-6" color="var(--line)" height="h-1.5" />
          <Bar width="w-6" color="var(--line)" height="h-1.5" />
          <div
            className="h-4 w-9 rounded-full"
            style={{ background: accent }}
          />
        </div>
      </div>
      <div
        className="relative flex h-[52%] flex-col justify-end rounded-lg p-3.5"
        style={{
          background: `linear-gradient(160deg, ${accent}, ${accent}99)`,
        }}
      >
        <Bar width="w-2/5" color="#ffffff" opacity={0.9} height="h-2.5" />
        <div className="mt-2">
          <Bar width="w-3/5" color="#ffffff" opacity={0.55} height="h-1.5" />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-md bg-mist p-2">
            <div
              className="h-6 w-full rounded"
              style={{ background: `${accent}33` }}
            />
            <Bar width="w-4/5" color="var(--line)" height="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandscapingMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color={accent} opacity={0.55} />
        <div
          className="h-4 w-9 rounded-full"
          style={{ background: accent }}
        />
      </div>
      <div className="grid flex-[1.4] grid-cols-2 gap-3">
        <div className="flex flex-col justify-center gap-2">
          <Bar width="w-4/5" color="var(--ink)" opacity={0.75} height="h-2.5" />
          <Bar width="w-3/5" color="var(--ink)" opacity={0.75} height="h-2.5" />
          <Bar width="w-2/3" color="var(--ink-soft)" opacity={0.4} />
          <div
            className="mt-1.5 h-6 w-20 rounded-full"
            style={{ background: accent }}
          />
        </div>
        <div
          className="rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${accent}55, ${accent}15)`,
          }}
        />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div
          className="rounded-md"
          style={{ background: `${accent}22` }}
        />
        <div
          className="rounded-md"
          style={{ background: `${accent}40` }}
        />
      </div>
    </div>
  );
}

export function AutoDetailMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-navy p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color="#ffffff" opacity={0.7} />
        <div className="flex gap-2.5">
          <Bar width="w-6" color="#ffffff" opacity={0.25} height="h-1.5" />
          <Bar width="w-6" color="#ffffff" opacity={0.25} height="h-1.5" />
          <div
            className="h-4 w-9 rounded-full"
            style={{ background: accent }}
          />
        </div>
      </div>
      <div className="flex-1">
        <Bar width="w-1/2" color={accent} height="h-3" />
        <div className="mt-2">
          <Bar width="w-3/5" color="#ffffff" opacity={0.3} height="h-1.5" />
        </div>
      </div>
      <div className="space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md border px-2.5 py-1.5"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
            <Bar width="w-2/5" color="#ffffff" opacity={0.5} height="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GymMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color="var(--ink)" opacity={0.75} />
        <div
          className="h-4 w-9 rounded-full"
          style={{ background: accent }}
        />
      </div>
      <div className="flex-1">
        <Bar width="w-3/5" color="var(--ink)" opacity={0.8} height="h-3" />
        <div className="mt-2">
          <Bar width="w-2/5" color="var(--ink-soft)" opacity={0.45} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["500+", "12", "24/7"].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-lg py-3"
            style={{ background: `${accent}20` }}
          >
            <span className="text-sm font-bold" style={{ color: "var(--ocean)" }}>
              {stat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LocalServiceMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color={accent} opacity={0.6} />
        <div
          className="h-4 w-9 rounded-full"
          style={{ background: accent }}
        />
      </div>
      <div
        className="flex flex-[1.3] flex-col justify-center gap-2 rounded-lg p-3.5"
        style={{ background: "var(--mist)" }}
      >
        <Bar width="w-3/5" color="var(--ink)" opacity={0.8} height="h-2.5" />
        <Bar width="w-2/5" color="var(--ink-soft)" opacity={0.45} />
        <div className="mt-1 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 w-14 rounded-full border"
              style={{ borderColor: `${accent}55` }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between rounded-lg px-3.5" style={{ background: `${accent}15` }}>
        <Bar width="w-2/5" color={accent} opacity={0.8} height="h-1.5" />
        <div className="h-5 w-16 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

export function MarketplaceMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color="var(--ink)" opacity={0.75} />
        <div className="h-4 w-9 rounded-full" style={{ background: accent }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Bar width="w-3/5" color="var(--ink)" opacity={0.8} height="h-2.5" />
        <Bar width="w-2/5" color="var(--ink-soft)" opacity={0.4} height="h-1.5" />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-md bg-mist p-1.5">
            <div
              className="h-8 w-full rounded"
              style={{ background: `${accent}30` }}
            />
            <Bar width="w-3/5" color="var(--line)" height="h-1.5" />
            <Bar width="w-2/5" color={accent} opacity={0.7} height="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SalonMockup({ accent }: MockupProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <Bar width="w-16" color="var(--ink)" opacity={0.75} />
        <div className="h-4 w-9 rounded-full" style={{ background: accent }} />
      </div>
      <div className="flex flex-col gap-2">
        <Bar width="w-3/5" color="var(--ink)" opacity={0.8} height="h-2.5" />
        <Bar width="w-2/5" color="var(--ink-soft)" opacity={0.4} height="h-1.5" />
        <div className="mt-1 h-5 w-24 rounded-full" style={{ background: accent }} />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-md"
            style={{ background: `${accent}${i % 2 === 0 ? "30" : "18"}` }}
          />
        ))}
      </div>
    </div>
  );
}
