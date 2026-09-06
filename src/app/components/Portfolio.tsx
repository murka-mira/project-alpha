"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { SalonMockup, MarketplaceMockup } from "./PortfolioMockups";

const projects = [
  {
    name: "Hair Design by Kevin",
    category: "Hair Salon",
    accent: "#8fe9ef",
    Mockup: SalonMockup,
    url: "https://no6.ebellabs.com/p/hair-design-by-kevin",
  },
  {
    name: "Share Your Boat",
    category: "Boat Marketplace",
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
    const distance = card ? card.clientWidth + 24 : 360;
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  return (
    <section id="work" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
              Featured Work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Websites built to perform
            </h2>
            <p className="mt-4 text-ink-soft">
              A look at recent projects designed and built for local
              businesses across Southern California.
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
        className="relative mt-14"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory justify-center gap-6 overflow-x-auto px-6 pb-4"
        >
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.url ?? "#contact"}
              target={project.url ? "_blank" : undefined}
              rel={project.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group block w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/[0.06] sm:w-[380px]"
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

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                    {project.category}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-ink">
                    {project.name}
                  </h3>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-ink transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-ink group-hover:text-white">
                  {project.url ? (
                    <ExternalLink size={15} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
