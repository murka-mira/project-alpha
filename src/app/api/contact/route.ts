import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, business, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Waveform Web <onboarding@resend.dev>",
    to: "ebeldylan@icloud.com",
    replyTo: email,
    subject: `New message from ${name}${business ? ` (${business})` : ""}`,
    text: `From: ${name}\nEmail: ${email}${business ? `\nBusiness: ${business}` : ""}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
