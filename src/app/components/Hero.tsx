"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import WaveDivider from "./WaveDivider";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-navy via-navy-2 to-navy-3 pb-28 pt-40 sm:pt-48"
    >
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="animate-blob absolute -left-32 top-10 h-80 w-80 rounded-full bg-ocean/40 blur-[100px]"
      />
      <div
        aria-hidden
        className="animate-blob absolute -right-24 top-40 h-96 w-96 rounded-full bg-aqua/20 blur-[120px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        aria-hidden
        className="animate-blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-green/10 blur-[110px]"
        style={{ animationDelay: "-3s" }}
      />

      {/* Faint wave lines */}
      <svg
        aria-hidden
        className="animate-wave-drift-slow absolute inset-x-0 top-24 w-full opacity-20"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C240,20 480,180 720,100 C960,20 1200,180 1440,100"
          stroke="url(#heroLine)"
          strokeWidth="2"
          fill="none"
        />
        <defs>
          <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3fd0e0" />
            <stop offset="100%" stopColor="#2bd6a0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-aqua-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          Web design studio &middot; Southern California
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Websites that make your{" "}
          <span className="text-gradient-aqua">business stand out.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/70"
        >
          Waveform Web creates modern, fast, professional websites for local
          businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            <Play size={16} className="text-ocean" />
            See My Work
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ocean-2 via-aqua to-green px-7 py-3.5 text-sm font-semibold text-navy shadow-xl shadow-aqua/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Get a Website
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-20 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-widest text-white/40"
        >
          <span>Fast</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>Modern</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>Mobile-first</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>Built to convert</span>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <WaveDivider fill="#ffffff" />
      </div>
    </section>
  );
}
