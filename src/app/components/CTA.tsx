"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedWaves from "./AnimatedWaves";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center sm:px-16"
        >
          <div className="absolute inset-x-0 bottom-0 h-40 opacity-70">
            <AnimatedWaves />
          </div>

          <h2 className="relative text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to put your business online?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/60">
            Let&apos;s build a website that actually represents your
            business — and brings in customers while you sleep.
          </p>
          <a
            href="#contact"
            className="group relative mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-navy shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Let&apos;s Build It
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
