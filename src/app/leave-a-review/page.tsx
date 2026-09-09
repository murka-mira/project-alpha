import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewForm from "../components/ReviewForm";
import { FishDoodle, SparkleDoodle } from "../components/Doodles";

export const metadata: Metadata = {
  title: "Leave a Review | Waveform Web",
  description: "Share your experience working with Waveform Web.",
};

export default function LeaveAReviewPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-white pb-16 pt-28 sm:pb-20">
        <FishDoodle
          size={28}
          className="animate-wave-drift-slow absolute left-12 top-32 hidden text-aqua/40 xl:block"
        />
        <SparkleDoodle
          size={16}
          className="animate-wobble absolute right-14 top-48 hidden text-ocean/40 xl:block"
        />
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Reviews
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Leave a review
          </h1>
          <p className="mt-4 text-ink-soft">
            Worked with Waveform Web? I&apos;d love to hear how it went.
            Reviews may be featured as testimonials on the site.
          </p>

          <div className="mt-8">
            <ReviewForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
