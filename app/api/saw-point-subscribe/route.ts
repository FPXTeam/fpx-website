import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();

  if (!name || !email) {
    return NextResponse.json({ error: "Please enter your name and email." }, { status: 400 });
  }

  const webhook = process.env.SAW_POINT_SUBSCRIBE_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Saw Point subscriptions are not configured yet." }, { status: 500 });
  }

  const result = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      source: "FPX website footer",
      list: "Saw Point"
    })
  });

  if (!result.ok) {
    console.error("Saw Point subscribe webhook failed", await result.text());
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
