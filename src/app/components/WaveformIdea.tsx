"use client";

import { motion } from "framer-motion";
import AnimatedWaves from "./AnimatedWaves";

export default function WaveformIdea() {
  return (
    <section id="waveform" className="relative overflow-hidden bg-navy py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="font-hand text-2xl text-aqua-2">
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
        <AnimatedWaves />
      </motion.div>
    </section>
  );
}
