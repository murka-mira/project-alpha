"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedWaves from "./AnimatedWaves";
import WaveformLogo from "./WaveformLogo";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden bg-navy"
    >
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <WaveformLogo className="w-56 sm:w-64" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Helping small businesses make waves online.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-6 max-w-md text-lg text-white/60"
        >
          Hey! I&apos;m the person behind Waveform Web. I build websites for
          small businesses that don&apos;t have one yet — or need a better
          one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-aqua px-7 py-3.5 text-sm font-semibold text-navy transition-transform duration-200 hover:-rotate-1 hover:scale-[1.03]"
          >
            See What I&apos;ve Built
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#contact"
            className="font-hand text-lg text-white/60 underline decoration-white/30 decoration-wavy underline-offset-4 transition-colors hover:text-white"
          >
            or say hi →
          </a>
        </motion.div>
      </div>

      <div className="relative z-0">
        <AnimatedWaves />
      </div>
    </section>
  );
}
