"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Waveform Web took our outdated site and turned it into something we're actually proud to share with customers. Bookings went up within the first month.",
    name: "Maria Delgado",
    role: "Owner, Coastal Realty Group",
  },
  {
    quote:
      "The process was so easy. Clear communication, fast turnaround, and the final site looked more premium than I expected for the price.",
    name: "James Ortega",
    role: "Founder, Salt & Grain",
  },
  {
    quote:
      "Finally a website that loads fast and actually reflects how professional our practice is. Patients comment on it all the time.",
    name: "Dr. Lena Huang",
    role: "Bluewater Dental",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Trusted by local businesses
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex gap-0.5 text-aqua">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-green text-sm font-semibold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
