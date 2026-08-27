import { NextResponse } from "next/server";
import db from "../../../lib/db";

const clean = (value, max) => typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, max) : "";

export async function POST(request) {
  try {
    const body = await request.json();
    const type = body.type === "seller" || body.type === "buyer" ? body.type : "";
    const name = clean(body.name, 100);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160);
    const city = clean(body.city, 120);
    const details = clean(body.details, 2000);
    if (!type || !name || !city || !details || !/^[0-9+()\s-]{7,40}$/.test(phone)) return NextResponse.json({ error: "يرجى استكمال البيانات وإدخال رقم هاتف صحيح." }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح." }, { status: 400 });
    const client = await db;
    await client.db(process.env.MONGODB_DB).collection("marketingRequests").insertOne({ type, name, phone, email, city, details, status: "new", createdAt: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Marketing request failed:", error?.message || "unknown error");
    return NextResponse.json({ error: "تعذر حفظ الطلب حاليًا. حاول مرة أخرى." }, { status: 500 });
  }
}
