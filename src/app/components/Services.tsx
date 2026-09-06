"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, Gauge, Smartphone, Search } from "lucide-react";

const services = [
  {
    icon: LayoutTemplate,
    title: "Custom Web Design",
    description:
      "Original, on-brand designs tailored to your business — never a generic template.",
  },
  {
    icon: Gauge,
    title: "Performance & Speed",
    description:
      "Lightweight, optimized builds that load fast and keep visitors engaged.",
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    description:
      "Pixel-perfect across desktop, tablet, and mobile — built on modern frameworks.",
  },
  {
    icon: Search,
    title: "SEO Foundations",
    description:
      "Clean structure and on-page SEO so local customers can actually find you.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-mist py-24 sm:py-32">
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
