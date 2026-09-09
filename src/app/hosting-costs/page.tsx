import type { Metadata } from "next";
import Link from "next/link";
import { Globe, ShieldCheck, Wrench } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BubbleCluster, WaterLines } from "../components/Doodles";

export const metadata: Metadata = {
  title: "Monthly Hosting Costs | Waveform Web",
  description:
    "What the optional monthly hosting cost covers for a Waveform Web website.",
};

const included = [
  {
    icon: Globe,
    title: "Website hosting",
    text: "keeps your website online",
  },
  {
    icon: ShieldCheck,
    title: "Security & basic maintenance",
    text: "helps keep the site running properly",
  },
  {
    icon: Wrench,
    title: "Updates & support",
    text: "small changes and fixes when needed",
  },
];

export default function HostingCostsPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-white pb-16 pt-28 sm:pb-20">
        <BubbleCluster
          size={40}
          className="animate-blob absolute left-10 top-36 hidden text-aqua/30 xl:block"
        />
        <WaterLines
          size={52}
          className="absolute right-12 top-56 hidden text-ocean/40 xl:block"
        />
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What is the monthly website cost?
          </h1>

          <div className="mt-6 space-y-4 text-ink-soft">
            <p>
              Every website needs{" "}
              <strong className="font-semibold text-ink">hosting</strong>{" "}
              to stay online — it&apos;s not optional, so it comes with an
              ongoing monthly cost.
            </p>
            <p>
              Think of hosting like leasing a small space on the internet for
              your website. It keeps your site available for customers to
              visit 24/7.
            </p>
            <p>At Waveform Web, your monthly price may include:</p>
          </div>

          <ul className="mt-6 space-y-3">
            {included.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-line bg-mist p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-ocean">
                  <item.icon size={16} strokeWidth={1.75} />
                </span>
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{item.title}</span>{" "}
                  — {item.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-4 text-ink-soft">
            <p>
              Because hosting is an ongoing service, the monthly price can
              continue as long as you want Waveform Web to host and maintain
              your website.
            </p>
            <p className="font-semibold text-ink">
              The exact monthly price depends on the website and the hosting
              costs required for it. Before starting, you&apos;ll know what
              your monthly cost will be — no surprise hosting fees.
            </p>
          </div>

          <blockquote className="font-hand mt-8 rounded-2xl border-2 border-dashed border-ocean/40 bg-mist px-5 py-4 text-xl text-ink sm:text-2xl">
            One-time website setup + affordable monthly hosting = a website
            that&apos;s ready to grow with your business.
          </blockquote>

          <Link
            href="/#pricing"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:underline"
          >
            ← Back to pricing
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
