// Small hand-drawn, ocean-themed accents used to frame cards/widgets
// throughout the site. Kept lightweight (inline SVG, no images) and always
// hidden below `lg` so they never crowd mobile layouts.

export function SurfboardDoodle({
  size = 24,
  strokeWidth = 1.75,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <path
        d="M12 2c3 4 5 10 5 14a5 5 0 0 1-10 0c0-4 2-10 5-14Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M12 6v13"
        stroke="currentColor"
        strokeWidth={Math.max(strokeWidth - 0.25, 1)}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FishDoodle({
  size = 24,
  strokeWidth = 1.75,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 20"
      fill="none"
      width={size}
      height={(size * 20) / 28}
      className={className}
    >
      <path
        d="M2 10c2.5-4.5 8-7 13-6 4 .8 7 3 9 6-2 3-5 5.2-9 6-5 1-10.5-1.5-13-6Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M24 10c1.4-1.3 2.6-2 3.5-2-0.7 1.3-0.7 2.7 0 4-0.9 0-2.1-.7-3.5-2Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function SparkleDoodle({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <path
        d="M10 1c.4 3.4 1.4 6 3 7.5 1.6 1.5 4 2.2 5.5 2.5-1.5.3-3.9 1-5.5 2.5-1.6 1.5-2.6 4.1-3 7.5-.4-3.4-1.4-6-3-7.5C5.4 12 3 11.3 1.5 11c1.5-.3 3.9-1 5.5-2.5C8.6 7 9.6 4.4 10 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WaterLines({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 16"
      fill="none"
      width={size}
      height={(size * 16) / 40}
      className={className}
    >
      <path
        d="M1 3c4-2 7 2 11 0s7-2 11 0 7 2 11 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M1 9c4-2 7 2 11 0s7-2 11 0 7 2 11 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function BubbleCluster({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="10" cy="28" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="14" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="2.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
