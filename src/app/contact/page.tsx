"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    setStatus(res.ok ? "sent" : "error");
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:bg-white/8 transition-colors font-mono text-sm";

  return (
    <main className="flex-1 max-w-xl mx-auto w-full px-6 py-16">
      <h1 className="text-4xl font-bold text-white mb-2">Contact Me</h1>
      <p className="text-slate-400 mb-10 text-sm">
        Have a question, idea, or game to share? Send me a message.
      </p>

      {status === "sent" ? (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-6 py-8 text-center">
          <p className="text-sky-300 font-mono text-lg font-semibold mb-2">Message sent!</p>
          <p className="text-slate-400 text-sm">Thanks, I&apos;ll get back to you soon.</p>
          <button
            onClick={() => { setStatus("idle"); setName(""); setEmail(""); setMessage(""); }}
            className="mt-6 text-xs font-mono text-slate-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              className={inputClass + " resize-none"}
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-xs font-mono">Something went wrong — please try again.</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 w-full py-3 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono font-semibold text-sm tracking-widest hover:bg-sky-500/30 hover:border-sky-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      )}
    </main>
  );
}
