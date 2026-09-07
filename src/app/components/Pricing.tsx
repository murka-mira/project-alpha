"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

// Edit prices/features here — nothing else in this file needs to change.
const PACKAGES = [
  {
    name: "Starter",
    price: 375,
    billing: "one-time",
    description: "A clean, professional one-page site to get you online fast.",
    features: [
      "1-page custom website",
      "Mobile-responsive design",
      "Contact form",
      "Basic on-page SEO",
      "2-week turnaround",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: 750,
    billing: "one-time",
    description: "The most popular choice for small businesses ready to grow.",
    features: [
      "Up to 5 pages",
      "Custom design & copy support",
      "Mobile-responsive design",
      "Contact form + Google Maps",
      "SEO optimization",
      "1 round of revisions",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: 1250,
    billing: "one-time",
    description: "A full-featured site for businesses that need more.",
    features: [
      "Everything in Growth",
      "Up to 10 pages",
      "Booking or online ordering ready",
      "Advanced SEO setup",
      "2 rounds of revisions",
      "30 days of post-launch support",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Simple, transparent packages
          </h2>
          <p className="mt-4 text-ink-soft">
            No hidden fees, no surprise invoices. Pick the package that fits
            your business — every site is built and owned by you.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl p-8 ${
                pkg.highlighted
                  ? "bg-navy text-white shadow-xl shadow-ink/15 lg:-translate-y-3"
                  : "border border-line bg-white shadow-sm"
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-aqua px-3.5 py-1 text-xs font-semibold text-navy">
                  Most Popular
                </span>
              )}

              <h3
                className={`text-lg font-semibold ${
                  pkg.highlighted ? "text-white" : "text-ink"
                }`}
              >
                {pkg.name}
              </h3>
              <p
                className={`mt-1.5 text-sm ${
                  pkg.highlighted ? "text-white/60" : "text-ink-soft"
                }`}
              >
                {pkg.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className={`text-4xl font-bold tracking-tight ${
                    pkg.highlighted ? "text-white" : "text-ink"
                  }`}
                >
                  ${pkg.price.toLocaleString()}
                </span>
                <span
                  className={`text-sm ${
                    pkg.highlighted ? "text-white/50" : "text-ink-soft"
                  }`}
                >
                  {pkg.billing}
                </span>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      className={`mt-0.5 shrink-0 ${
                        pkg.highlighted ? "text-aqua" : "text-ocean"
                      }`}
                    />
                    <span className={pkg.highlighted ? "text-white/80" : "text-ink-soft"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  pkg.highlighted
                    ? "bg-white text-navy hover:shadow-lg"
                    : "bg-navy text-white hover:shadow-lg hover:shadow-ink/10"
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-soft">
          Have a bigger project in mind?{" "}
          <a href="#contact" className="font-medium text-ocean hover:underline">
            Get in touch
          </a>{" "}
          for a custom quote.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-ink-soft">
          Prices above do not include{" "}
          <Link
            href="/hosting-costs"
            className="font-medium text-ocean hover:underline"
          >
            monthly hosting costs
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
