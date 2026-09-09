import type { Metadata } from "next";
import Link from "next/link";
import { Star, MessageSquarePlus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getReviews } from "@/lib/reviews";
import { WaterLines, BubbleCluster } from "../components/Doodles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials | Waveform Web",
  description: "What clients are saying about working with Waveform Web.",
};

export default async function TestimonialsPage() {
  const reviews = await getReviews();

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-white pb-16 pt-28 sm:pb-20">
        <BubbleCluster
          size={40}
          className="animate-blob absolute left-8 top-32 hidden text-ocean/30 lg:block"
        />
        <WaterLines
          size={56}
          className="absolute right-10 top-48 hidden text-aqua/40 lg:block"
        />
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
              Testimonials
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              What clients are saying
            </h1>
          </div>

          {reviews.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {reviews.map((r) => (
                <figure
                  key={r.id}
                  className="flex flex-col rounded-2xl border border-line bg-mist p-7 shadow-sm"
                >
                  <div className="flex gap-0.5 text-ocean">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={15}
                        fill={idx < r.rating ? "currentColor" : "none"}
                        strokeWidth={idx < r.rating ? 0 : 1.5}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                    &ldquo;{r.review}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{r.name}</p>
                      {r.business && (
                        <p className="text-xs text-ink-soft">{r.business}</p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-line bg-mist p-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ocean shadow-sm">
                <MessageSquarePlus size={22} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-ink">
                No reviews yet
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                This page is just getting started — check back soon, or be
                the first to share how your project went.
              </p>
              <Link
                href="/leave-a-review"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Leave a Review
              </Link>
            </div>
          )}

          <Link
            href="/#work"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:underline"
          >
            ← Back to portfolio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
