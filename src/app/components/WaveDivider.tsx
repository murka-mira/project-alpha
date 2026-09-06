type WaveDividerProps = {
  fill?: string;
  flip?: boolean;
  className?: string;
};

export default function WaveDivider({
  fill = "#ffffff",
  flip = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none w-full overflow-hidden leading-none ${
        flip ? "rotate-180" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 120"
        className="h-16 w-full sm:h-24"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,110 480,-10 720,40 C960,90 1200,10 1440,50 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
