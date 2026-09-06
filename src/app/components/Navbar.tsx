"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled
              ? "glass-navy shadow-[0_8px_30px_rgba(6,21,36,0.35)]"
              : "bg-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ocean via-aqua to-green">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white">
                <path
                  d="M2 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span
              className={`text-lg font-semibold tracking-tight transition-colors ${
                scrolled ? "text-white" : "text-white"
              }`}
            >
              Waveform Web
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-aqua to-green px-5 py-2.5 text-sm font-semibold text-navy shadow-lg shadow-aqua/20 transition-transform hover:scale-105 md:inline-block"
          >
            Get a Website
          </a>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="text-white md:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-4 md:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-to-r from-aqua to-green px-4 py-2.5 text-center text-sm font-semibold text-navy"
            >
              Get a Website
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
