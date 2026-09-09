"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2 } from "lucide-react";

// Zoom must be connected under calendly.com -> Integrations -> Zoom for
// bookings to get a video link. Each booking gets its own private Zoom
// link, emailed to both sides — nothing is ever posted publicly here.
const SCHEDULING_URL = "https://calendly.com/ebeldylan/15-minute-meeting";

const expectations = [
  "15 minute conversation",
  "Talk about your business and website goals",
  "Ask any questions you have",
  "No pressure — just a conversation",
];

export default function ScheduleCall() {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        setBooked(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!SCHEDULING_URL || booked) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [booked]);

  return (
    <div className="rounded-2xl border border-line bg-white p-8 shadow-sm sm:p-10">
      {booked ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
            <CheckCircle2 size={28} />
          </span>
          <h3 className="mt-5 text-xl font-semibold text-ink">
            You&apos;re booked!
          </h3>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            You&apos;ll receive the meeting details by email.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold uppercase tracking-widest text-ocean">
            Schedule a Call
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Let&apos;s Talk About Your Website
          </h3>
          <p className="mt-3 text-ink-soft">
            Have an idea for your business website? Schedule a quick call and
            let&apos;s talk about what you need.
          </p>

          <ul className="mt-6 space-y-2.5">
            {expectations.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-ink-soft"
              >
                <Check
                  size={16}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0 text-ocean"
                />
                {item}
              </li>
            ))}
          </ul>

          {SCHEDULING_URL ? (
            <div
              className="calendly-inline-widget mt-8 overflow-hidden rounded-xl border border-line"
              data-url={`${SCHEDULING_URL}?hide_gdpr_banner=1&primary_color=1c86c9`}
              style={{ minWidth: "280px", height: "900px" }}
            />
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-line bg-mist p-6 text-center text-sm text-ink-soft">
              Online scheduling is being set up. In the meantime, email me
              directly to find a time:
              <a
                href="mailto:ebeldylan@icloud.com"
                className="mt-1 block font-medium text-ocean hover:underline"
              >
                ebeldylan@icloud.com
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
