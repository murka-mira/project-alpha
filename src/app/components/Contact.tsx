"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
  }

  return (
    <section id="contact" className="relative bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Let&apos;s build your website
            </h2>
            <p className="mt-4 text-ink-soft">
              Tell me a bit about your business and what you&apos;re looking
              for. I&apos;ll get back to you within one business day.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:hello@waveformweb.com"
                className="flex items-center gap-3 text-sm text-ink-soft transition-colors hover:text-ocean"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <Mail size={17} className="text-ocean" />
                </span>
                hello@waveformweb.com
              </a>
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin size={17} className="text-ocean" />
                </span>
                Southern California
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm sm:p-10">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-aqua to-green text-white">
                    <CheckCircle2 size={28} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">
                    Message sent
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-ink-soft">
                    Thanks for reaching out — I&apos;ll be in touch within one
                    business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="w-full rounded-xl border border-black/10 bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-xs font-medium text-ink-soft"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-xl border border-black/10 bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
                        placeholder="jane@business.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="business"
                      className="mb-1.5 block text-xs font-medium text-ink-soft"
                    >
                      Business name
                    </label>
                    <input
                      id="business"
                      name="business"
                      type="text"
                      className="w-full rounded-xl border border-black/10 bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
                      placeholder="Your Business"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-medium text-ink-soft"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full resize-none rounded-xl border border-black/10 bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean focus:bg-white"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ocean via-aqua to-green px-6 py-3.5 text-sm font-semibold text-navy shadow-lg shadow-ocean/20 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                  >
                    Send Message
                    <Send
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
