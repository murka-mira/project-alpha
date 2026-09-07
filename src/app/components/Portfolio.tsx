"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SalonMockup, MarketplaceMockup } from "./PortfolioMockups";

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
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("a");
    const distance = card ? card.clientWidth + 32 : 400;
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  return (
    <section id="work" className="relative bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-hand text-2xl text-ocean">
              Stuff I&apos;ve Built 🌊
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              My Work
            </h2>
            <p className="mt-4 text-ink-soft">
              A couple of real sites for real local businesses — more going
              up here as I finish them.
            </p>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll portfolio left"
              onClick={() => scrollByCard(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ocean hover:text-ocean"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Scroll portfolio right"
              onClick={() => scrollByCard(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ocean hover:text-ocean"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative mt-10"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory justify-center gap-8 overflow-x-auto px-6 py-4"
        >
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group block w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:w-[380px]"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>

              <div className="aspect-[16/10] overflow-hidden">
                <project.Mockup accent={project.accent} />
              </div>

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                  {project.category}
                </p>
                <h3 className="mt-1 text-base font-semibold text-ink">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {project.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean">
                  View Project
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
