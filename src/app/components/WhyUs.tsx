"use client";

import { motion } from "framer-motion";

const reasons = [
  { text: "I'm not a giant company.", rotate: "-rotate-1" },
  { text: "You talk directly to me.", rotate: "rotate-1" },
  { text: "I actually care about making your website good.", rotate: "-rotate-1" },
  { text: "And I'm always learning new stuff.", rotate: "rotate-1" },
];

export default function WhyUs() {
  return (
    <section id="why" className="relative bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-hand -rotate-1 text-2xl text-ocean">
          The Honest Version
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Why Waveform Web?
        </h2>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-3xl gap-4 px-6 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <motion.div
            key={reason.text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`flex items-start gap-3 rounded-xl border border-line bg-white p-5 ${reason.rotate}`}
          >
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-aqua">
              <path
                d="M4 12.5 9 17l11-11"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-base font-medium text-ink">{reason.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
