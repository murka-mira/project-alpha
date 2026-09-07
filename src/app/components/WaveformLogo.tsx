export default function WaveformLogo({ className = "w-64" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/waveform-logo.png" alt="Waveform Web" className={className} />
  );
}
