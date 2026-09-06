"use client";

import { motion } from "framer-motion";
import { MessageSquare, Hammer, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell me what you need",
    description:
      "A quick call or form about your business, your customers, and what your site needs to do.",
  },
  {
    icon: Hammer,
    number: "02",
    title: "I build your website",
    description:
      "I design and build your site personally, with check-ins so you always know where things stand.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "You launch",
    description:
      "Your site goes live — fast, polished, and ready to bring in new customers.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
          How It Works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          From idea to online.
        </h2>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
          <div
            aria-hidden
            className="absolute top-8 hidden h-px w-full bg-line sm:block"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white shadow-lg shadow-ink/10">
                <step.icon size={24} strokeWidth={1.75} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ocean ring-1 ring-line">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
