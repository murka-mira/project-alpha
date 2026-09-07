export default function WaveformMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/waveform-icon.png"
      alt="Waveform Web"
      className={`${className} object-cover`}
      style={{ objectPosition: "75% 40%" }}
    />
  );
}
