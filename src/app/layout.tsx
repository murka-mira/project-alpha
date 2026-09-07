import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Waveform Web | Modern Websites for Local Businesses",
  description:
    "I design modern websites for local businesses that want to look their best online. Waveform Web is a one-person web design studio in Irvine, California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${caveat.variable} antialiased`}
    >
      <body className="bg-white text-ink">{children}</body>
    </html>
  );
}
