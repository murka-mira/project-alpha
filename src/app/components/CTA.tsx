"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-2 to-ocean px-8 py-16 text-center sm:px-16"
        >
          <div
            aria-hidden
            className="animate-wave-drift absolute inset-x-0 bottom-0 opacity-40"
          >
            <svg
              viewBox="0 0 1440 160"
              className="w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,80 C240,20 480,140 720,80 C960,20 1200,140 1440,80 L1440,160 L0,160 Z"
                fill="url(#ctaWave)"
              />
              <defs>
                <linearGradient id="ctaWave" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3fd0e0" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2bd6a0" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to make waves online?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/70">
            Let&apos;s build a website that actually represents your
            business — and brings in customers while you sleep.
          </p>
          <a
            href="#contact"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua to-green px-8 py-3.5 text-sm font-semibold text-navy shadow-xl shadow-aqua/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Get a Website
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
