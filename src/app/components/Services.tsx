"use client";

import { motion } from "framer-motion";
import {
  LayoutTemplate,
  RefreshCw,
  Smartphone,
  Rocket,
  MessageSquare,
  Hammer,
} from "lucide-react";
import { WaveDivider, CornerBubbles } from "./OceanDecor";
import { BubbleCluster, WaterLines } from "./Doodles";

const services = [
  {
    icon: LayoutTemplate,
    title: "Website Design",
    description: "Modern websites designed specifically for your business.",
  },
  {
    icon: RefreshCw,
    title: "Website Redesign",
    description: "Take an outdated website and give it a completely new look.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Design",
    description: "Make sure customers have a great experience on phones and tablets.",
  },
  {
    icon: Rocket,
    title: "Getting Online",
    description:
      "Help businesses that currently don't have a website establish their online presence.",
  },
];

const steps = [
  { icon: MessageSquare, number: "01", title: "We talk" },
  { icon: Hammer, number: "02", title: "I build" },
  { icon: Rocket, number: "03", title: "We launch" },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-mist py-16 sm:py-24">
      <WaveDivider className="absolute inset-x-0 top-0" />
      <CornerBubbles className="left-0 top-6 sm:top-10" />
      <BubbleCluster
        size={44}
        className="animate-blob absolute right-8 top-20 hidden text-ocean/30 lg:block"
      />
      <WaterLines
        size={56}
        className="absolute bottom-16 left-8 hidden text-aqua/40 lg:block"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            What I Do
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything your website needs
          </h2>
          <p className="mt-4 text-ink-soft">
            From first sketch to launch day, I handle every piece of the
            process.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/[0.06]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-ocean transition-colors duration-300 group-hover:bg-ocean group-hover:text-white">
                <service.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 border-t border-line pt-10 sm:flex-row sm:justify-center sm:gap-12">
          {steps.map((step) => (
            <div key={step.title} className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                <step.icon size={16} strokeWidth={1.75} />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-ocean ring-1 ring-line">
                  {step.number}
                </span>
              </span>
              <span className="text-sm font-medium text-ink">{step.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
