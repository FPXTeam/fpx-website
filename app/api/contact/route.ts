import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const website = String(body.website || "").trim();
  if (website) return NextResponse.json({ ok: true });
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please complete your name, email and message." }, { status: 400 });
  }

  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (name.length > 120 || message.length > 5000) {
    return NextResponse.json({ error: "Please shorten your submission and try again." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !from || !to) {
    return NextResponse.json({ error: "The contact form is not configured yet." }, { status: 500 });
  }

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key
    },
    body: JSON.stringify({
      from: "FPX Website <" + from + ">",
      to: [to],
      reply_to: email,
      subject: "FPX website enquiry — " + String(body.topic || "General enquiry"),
      text: [
        "Name: " + name,
        "Company: " + String(body.company || "—"),
        "Email: " + email,
        "Phone: " + String(body.phone || "—"),
        "Topic: " + String(body.topic || "General enquiry"),
        "",
        message
      ].join("\n")
    })
  });

  if (!result.ok) {
    console.error("Resend failed", await result.text());
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
