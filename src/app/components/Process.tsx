"use client";

import { motion } from "framer-motion";
import { Compass, PenTool, Rocket } from "lucide-react";

const steps = [
  {
    icon: Compass,
    number: "01",
    title: "Discover",
    description:
      "We talk through your business, your customers, and what your site needs to do.",
  },
  {
    icon: PenTool,
    number: "02",
    title: "Design & Build",
    description:
      "I design and develop your site, with check-ins so you always know where things stand.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Launch",
    description:
      "Your site goes live — fast, polished, and ready to bring in new customers.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Simple Process
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From idea to launch in 3 steps
          </h2>
        </div>

        <div className="relative mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
          <div
            aria-hidden
            className="absolute top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-ocean/25 to-transparent sm:block"
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
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean via-aqua to-green text-white shadow-lg shadow-ocean/20">
                <step.icon size={26} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-aqua-2">
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
