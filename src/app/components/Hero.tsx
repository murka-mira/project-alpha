"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import AnimatedWaves from "./AnimatedWaves";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const wavesY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen flex-col overflow-hidden bg-navy"
    >
      {/* Soft ambient glow behind headline */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean/20 blur-[140px]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex flex-1 flex-col items-center justify-center px-6 pt-28 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-white/50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          Independent web design studio &middot; Southern California
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Websites that{" "}
          <span className="text-gradient-ocean">move your business</span>{" "}
          forward.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mx-auto mt-6 max-w-lg text-lg text-white/55"
        >
          Modern websites designed to help local businesses look better,
          reach more customers, and grow online.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-navy shadow-[0_8px_40px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_50px_rgba(75,216,230,0.25)]"
          >
            Start a Project
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5"
          >
            View My Work
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-10 mb-6 flex justify-center"
      >
        <a
          href="#work"
          aria-label="Scroll to see our work"
          className="flex flex-col items-center gap-1.5 text-white/30 transition-colors hover:text-white/60"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
            See our work
          </span>
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </motion.div>

      <motion.div style={{ y: wavesY }} className="absolute inset-x-0 bottom-0">
        <AnimatedWaves />
      </motion.div>
    </section>
  );
}
