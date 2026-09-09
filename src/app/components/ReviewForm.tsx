"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, Star } from "lucide-react";

export default function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-8 py-12 text-center shadow-sm sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-ink">
          Thanks for the review!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          I really appreciate it — this may be featured on the site as a
          testimonial.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-line bg-white p-8 shadow-sm sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-medium text-ink-soft"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-line bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label
            htmlFor="business"
            className="mb-1.5 block text-xs font-medium text-ink-soft"
          >
            Business (optional)
          </label>
          <input
            id="business"
            name="business"
            type="text"
            className="w-full rounded-xl border border-line bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
            placeholder="Your Business"
          />
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">
          Rating
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              onClick={() => setRating(value)}
              className="p-1"
            >
              <Star
                size={22}
                className={
                  value <= rating
                    ? "fill-aqua text-aqua"
                    : "fill-transparent text-line"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="review"
          className="mb-1.5 block text-xs font-medium text-ink-soft"
        >
          Your review
        </label>
        <textarea
          id="review"
          name="review"
          required
          rows={5}
          className="w-full resize-none rounded-xl border border-line bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
          placeholder="What was it like working together?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Submit Review"}
        <Send size={15} className="transition-transform group-hover:translate-x-1" />
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending your review. Please try again, or
          email{" "}
          <a href="mailto:ebeldylan@icloud.com" className="font-medium underline">
            ebeldylan@icloud.com
          </a>{" "}
          directly.
        </p>
      )}
    </form>
  );
}
