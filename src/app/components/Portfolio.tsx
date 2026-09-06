"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Coastal Realty Group",
    category: "Real Estate",
    gradient: "from-ocean via-ocean-2 to-aqua",
  },
  {
    name: "Salt & Grain",
    category: "Restaurant",
    gradient: "from-navy-3 via-ocean to-aqua-2",
  },
  {
    name: "Bluewater Dental",
    category: "Healthcare",
    gradient: "from-aqua via-aqua-2 to-green",
  },
  {
    name: "Harbor & Co. Fitness",
    category: "Fitness Studio",
    gradient: "from-ocean-2 via-aqua to-green",
  },
];

export default function Portfolio() {
  return (
    <section id="work" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Featured Work
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Websites built to perform
          </h2>
          <p className="mt-4 text-ink-soft">
            A look at recent projects designed and built for local businesses
            across Southern California.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              href="#contact"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative block overflow-hidden rounded-3xl"
            >
              <div
                className={`relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${project.gradient} p-7 transition-transform duration-500 group-hover:scale-[1.02]`}
              >
                <div
                  aria-hidden
                  className="animate-wave-drift absolute inset-x-0 bottom-0 opacity-30"
                >
                  <svg
                    viewBox="0 0 400 120"
                    className="w-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,60 C100,10 200,110 300,60 C350,35 380,45 400,60 L400,120 L0,120 Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                      {project.category}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {project.name}
                    </h3>
                  </div>
                  <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
