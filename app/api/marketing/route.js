import { NextResponse } from "next/server";
import db from "../../../lib/db";

const clean = (value, max) => typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, max) : "";
const types = ["شقة", "فيلا", "دوبلكس", "استوديو", "أخرى"];
const finishings = ["تشطيب كامل", "نصف تشطيب", "على الطوب", "أخرى"];

export async function POST(request) {
  try {
    const body = await request.json();
    const type = body.type === "sell" || body.type === "buy" ? body.type : "";
    const propertyType = clean(body.propertyType, 40);
    const name = clean(body.name, 100);
    const phone = clean(body.phone, 40);
    const location = clean(body.location, 120);
    const area = clean(body.area, 40);
    const finishing = clean(body.finishing, 60);
    const metersComplete = clean(body.metersComplete, 10);
    if (!type || !name || !location || !area || !propertyType || !finishing || !metersComplete || !/^[0-9+()\s-]{7,40}$/.test(phone)) return NextResponse.json({ error: "يرجى استكمال البيانات وإدخال رقم هاتف صحيح." }, { status: 400 });
    if (!types.includes(propertyType) || !finishings.includes(finishing) || !["نعم", "لا"].includes(metersComplete)) return NextResponse.json({ error: "يرجى اختيار قيم صحيحة للطلب." }, { status: 400 });
    const common = { name, phone, propertyType, location, area, finishing, metersComplete, status: "new", createdAt: new Date() };
    const item = type === "sell" ? { ...common, price: clean(body.price, 80), propertyNumber: clean(body.propertyNumber, 80) } : { ...common, budget: clean(body.budget, 80), requirements: clean(body.requirements, 2000) };
    if (type === "sell" && (!item.price || !item.propertyNumber)) return NextResponse.json({ error: "يرجى إدخال السعر ورقم العقار." }, { status: 400 });
    if (type === "buy" && !item.budget) return NextResponse.json({ error: "يرجى إدخال الميزانية." }, { status: 400 });
    const client = await db;
    await client.db(process.env.MONGODB_DB).collection(type === "sell" ? "property_sale_requests" : "property_buy_requests").insertOne(item);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Marketing request failed:", error?.message || "unknown error");
    return NextResponse.json({ error: "تعذر حفظ الطلب حاليًا. حاول مرة أخرى." }, { status: 500 });
  }
}
