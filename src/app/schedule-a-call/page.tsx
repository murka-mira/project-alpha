import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScheduleCall from "../components/ScheduleCall";
import { SurfboardDoodle, SparkleDoodle } from "../components/Doodles";

export const metadata: Metadata = {
  title: "Schedule a Call | Waveform Web",
  description: "Book a quick call to talk about your website project.",
};

export default function ScheduleACallPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-white pb-16 pt-28 sm:pb-20">
        <SurfboardDoodle
          size={30}
          className="animate-wobble absolute left-12 top-36 hidden text-ocean/30 xl:block"
        />
        <SparkleDoodle
          size={16}
          className="animate-wobble absolute right-14 top-56 hidden text-aqua/50 xl:block"
        />
        <div className="mx-auto max-w-2xl px-6">
          <ScheduleCall />

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
