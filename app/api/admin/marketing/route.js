import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verify } from "../../../../lib/auth";
import db from "../../../../lib/db";

async function guard() { const store = await cookies(); return verify(store.get("admin_token")?.value)?.role === "admin"; }
const serialize = (item, type) => ({ ...item, type, _id: item._id.toString(), createdAt: item.createdAt?.toISOString?.() || item.createdAt });
export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const client = await db; const database = client.db(process.env.MONGODB_DB);
  const [sell, buy] = await Promise.all([
    database.collection("property_sale_requests").find({}).sort({ createdAt: -1 }).toArray(),
    database.collection("property_buy_requests").find({}).sort({ createdAt: -1 }).toArray(),
  ]);
  return NextResponse.json({ sell: sell.map((item) => serialize(item, "sell")), buy: buy.map((item) => serialize(item, "buy")) });
}
export async function PATCH(request) {
  if (!(await guard())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id, type, status } = await request.json();
  if (!ObjectId.isValid(id) || !["sell", "buy"].includes(type) || !["new", "reviewed"].includes(status)) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  const client = await db; await client.db(process.env.MONGODB_DB).collection(type === "sell" ? "property_sale_requests" : "property_buy_requests").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return NextResponse.json({ success: true });
}
export async function DELETE(request) {
  if (!(await guard())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const query = new URL(request.url).searchParams; const id = query.get("id"); const type = query.get("type");
  if (!ObjectId.isValid(id) || !["sell", "buy"].includes(type)) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  const client = await db; await client.db(process.env.MONGODB_DB).collection(type === "sell" ? "property_sale_requests" : "property_buy_requests").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
