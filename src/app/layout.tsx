import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dylan's Void",
  description: "A personal space for games, tools, and more.",
};

type Star = { id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number };

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 137.508) % 100,
    y: (i * 97.421) % 100,
    size: (i % 3) + 1,
    opacity: ((i % 7) / 7) * 0.5 + 0.3,
    duration: ((i % 5) + 2) * 1.2,
    delay: (i % 7) * -0.8,
  }));
}

const stars = generateStars(180);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col relative overflow-x-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #1a2a4a 0%, #0a0f1e 50%, #000008 100%)" }}
      >
        {/* Fixed star layer */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {stars.map((star) => (
            <span
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                ["--star-opacity" as string]: star.opacity,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative flex flex-col flex-1 overflow-y-auto" style={{ zIndex: 1 }}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
