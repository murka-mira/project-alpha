import { Resend } from "resend";
import { NextResponse } from "next/server";
import { addReview } from "@/lib/reviews";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, business, rating, review } = await req.json();

  if (!name || !review) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const numericRating = Number(rating);
  const safeRating =
    Number.isFinite(numericRating) && numericRating >= 1 && numericRating <= 5
      ? Math.round(numericRating)
      : 5;

  const saved = await addReview({
    name,
    business: business || undefined,
    rating: safeRating,
    review,
  });

  // Best-effort notification email — the review is already saved above,
  // so a Resend failure here shouldn't fail the whole request.
  await resend.emails
    .send({
      from: "Waveform Web <onboarding@resend.dev>",
      to: "ebeldylan@icloud.com",
      subject: `New review from ${name}${business ? ` (${business})` : ""}`,
      text: `From: ${name}${business ? `\nBusiness: ${business}` : ""}\nRating: ${safeRating}/5\n\n${review}`,
    })
    .catch(() => {});

  return NextResponse.json({ ok: true, review: saved });
}
