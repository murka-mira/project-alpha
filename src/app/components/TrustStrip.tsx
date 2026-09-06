"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Tag, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: BadgeCheck,
    title: "Professional",
    description:
      "Custom-designed websites that make your business look established and credible online.",
  },
  {
    icon: Tag,
    title: "Affordable",
    description:
      "Straightforward, small-business-friendly pricing — no bloated retainers or agency markups.",
  },
  {
    icon: ShieldCheck,
    title: "Trustworthy",
    description:
      "Clear communication and timelines from a designer who stands behind every site.",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative border-b border-line bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-ocean">
                <point.icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">
                  {point.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
