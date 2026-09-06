"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Fish, Laptop } from "lucide-react";

function SurfboardDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2c3 4 5 10 5 14a5 5 0 0 1-10 0c0-4 2-10 5-14Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M12 6v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const doodles = [
  { icon: SurfboardDoodle, label: "Surfing" },
  { icon: Fish, label: "Fishing" },
  { icon: Laptop, label: "Web Design" },
];

const statusLines = [
  "🌊 currently making waves",
  "🎣 probably thinking about fishing",
  "🏄 surf > everything",
  "💻 building websites",
];

export default function About() {
  return (
    <section id="about" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-5 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="relative mx-auto aspect-square w-full max-w-sm -rotate-2 overflow-hidden rounded-2xl bg-mist ring-4 ring-white shadow-lg">
              <Image
                src="/dylan-photo.png"
                alt="Dylan, founder of Waveform Web"
                fill
                sizes="(min-width: 1024px) 320px, 384px"
                className="object-cover"
                priority
              />
            </div>

            <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2">
              {doodles.map((doodle) => (
                <div
                  key={doodle.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-mist py-3 text-ocean"
                >
                  <doodle.icon size={18} strokeWidth={1.75} />
                  <span className="text-[11px] font-medium leading-tight text-ink-soft">
                    {doodle.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2">
              {statusLines.map((line, i) => (
                <span
                  key={line}
                  className={`font-hand rounded-md bg-mist px-3 py-1 text-base text-ink-soft ${
                    i % 2 === 0 ? "-rotate-1" : "rotate-1"
                  }`}
                >
                  {line}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
              About Me
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              So... who&apos;s behind this?
            </h2>
            <div className="mt-5 space-y-4 text-ink-soft">
              <p>
                I&apos;m a young web designer who loves surfing, fishing,
                and building things on the computer. I started Waveform Web
                because I noticed that a lot of small businesses
                don&apos;t have websites, and I wanted to help them get more
                customers online.
              </p>
            </div>

            <blockquote className="font-hand mt-8 -rotate-1 rounded-2xl border-2 border-dashed border-ocean/40 bg-mist px-5 py-4 text-2xl text-ink">
              &ldquo;I want to help small businesses that don&apos;t have
              websites get more business.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
