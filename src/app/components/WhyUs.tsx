"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import WaveDivider from "./WaveDivider";

const reasons = [
  {
    title: "Direct with your designer",
    description:
      "No account managers or middlemen — you work directly with me from kickoff to launch.",
    accent: "from-ocean-2 to-aqua",
  },
  {
    title: "Built for local businesses",
    description:
      "I specialize in helping local brands look as credible as national ones online.",
    accent: "from-aqua to-ocean-2",
  },
  {
    title: "Fast turnaround",
    description:
      "Most sites go from kickoff to launch in a matter of weeks, not months.",
    accent: "from-aqua to-green",
  },
  {
    title: "Modern tech, built to last",
    description:
      "Clean, maintainable code on a modern stack — no bloated page builders.",
    accent: "from-ocean-2 to-aqua",
  },
];

export default function WhyUs() {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-navy-3 via-navy-2 to-navy py-24 sm:py-32">
      <div
        aria-hidden
        className="animate-blob absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-aqua/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="animate-blob absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-ocean-2/10 blur-[110px]"
        style={{ animationDelay: "-5s" }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-aqua-2">
            Why Waveform Web
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A dedicated designer, not a call center
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Waveform Web is built around one thing: giving local businesses a
            website they&apos;re genuinely proud to point customers to.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-navy ${reason.accent}`}>
                <Check size={16} strokeWidth={3} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">
                {reason.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <WaveDivider fill="#ffffff" />
      </div>
    </section>
  );
}
