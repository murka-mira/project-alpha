"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SalonMockup, MarketplaceMockup } from "./PortfolioMockups";
import { WaveDivider } from "./OceanDecor";
import { FishDoodle, SparkleDoodle } from "./Doodles";
import ParallaxDoodle from "./ParallaxDoodle";

const projects = [
  {
    name: "Hair Design by Kevin",
    category: "Hair Salon",
    description:
      "A clean site for a local hair salon, built to make booking an appointment easy.",
    accent: "#8fe9ef",
    Mockup: SalonMockup,
    url: "https://no6.ebellabs.com/p/hair-design-by-kevin",
  },
  {
    name: "Share Your Boat",
    category: "Boat Marketplace",
    description:
      "A listings marketplace connecting boat owners with people looking for a boat share.",
    accent: "#1c86c9",
    Mockup: MarketplaceMockup,
    url: "https://shareyourboat.com",
  },
];

export default function Portfolio() {
  return (
    <section id="work" className="relative overflow-hidden bg-white py-16 sm:py-24">
      <WaveDivider from="var(--mist)" to="#ffffff" flip />
      <ParallaxDoodle className="absolute right-10 top-28 hidden lg:block" range={22}>
        <FishDoodle size={26} className="animate-wave-drift -scale-x-100 text-ocean/30" />
      </ParallaxDoodle>
      <ParallaxDoodle className="absolute left-10 bottom-24 hidden lg:block" range={16}>
        <SparkleDoodle size={16} className="animate-wobble text-aqua/50" />
      </ParallaxDoodle>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            My Work
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Real sites for real businesses
          </h2>
          <p className="mt-4 text-ink-soft">
            A couple of live projects — more going up here as I finish them.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/[0.08]"
            >
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="aspect-[16/10] overflow-hidden">
                  <project.Mockup accent={project.accent} />
                </div>
              </a>

              <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                    {project.category}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10"
                >
                  View Project
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/[0.06]"
          >
            See What Clients Say
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
