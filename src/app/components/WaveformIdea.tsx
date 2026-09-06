"use client";

import { motion } from "framer-motion";
import AnimatedWaves from "./AnimatedWaves";

const bars = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  height: 20 + Math.abs(Math.sin(i * 0.6)) * 70,
  delay: (i % 7) * -0.3,
  duration: 1.2 + (i % 5) * 0.25,
}));

export default function WaveformIdea() {
  return (
    <section id="waveform" className="relative overflow-hidden bg-navy py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="font-hand -rotate-1 text-2xl text-aqua-2">
          The Waveform Idea
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Why Waveform?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          A waveform is movement, energy, and change — a signal that&apos;s
          always in motion. That&apos;s what I want to bring to every
          business I work with: something alive, not static.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mx-auto mt-14 h-48 max-w-4xl px-6 sm:h-56"
      >
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2">
          {bars.map((bar) => (
            <span
              key={bar.id}
              className="animate-bar-pulse w-1.5 shrink-0 rounded-full bg-gradient-to-t from-ocean-2 to-aqua sm:w-2"
              style={{
                height: `${bar.height}%`,
                animationDelay: `${bar.delay}s`,
                animationDuration: `${bar.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <AnimatedWaves />
        </div>
      </motion.div>
    </section>
  );
}
