import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '../../../../lib/db';
import { verify } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

async function guard() {
  const cookieStore = await cookies();
  return verify(cookieStore.get('admin_token')?.value)?.role === 'admin';
}
const jsonError = (error, status = 500) => NextResponse.json({ success: false, error }, { status });

export async function GET() {
  try {
    if (!(await guard())) return jsonError('غير مصرح', 401);
    const client = await db;
    const items = await client.db(process.env.MONGODB_DB).collection('content').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, items: items.map(x => ({ ...x, _id: x._id.toString() })) });
  } catch (error) {
    console.error('[v0] Admin content GET failed:', error);
    return jsonError('تعذر تحميل المحتوى');
  }
}

export async function POST(req) {
  try {
    if (!(await guard())) return jsonError('غير مصرح', 401);
    const body = await req.json();
    if (!body.title?.trim() || !body.description?.trim()) return jsonError('العنوان والوصف مطلوبان', 400);
    if (!['projects', 'finishing', 'investments'].includes(body.type)) return jsonError('قسم المحتوى غير صحيح', 400);
    const item = { title: body.title.trim(), description: body.description.trim(), type: body.type, image: body.image || '', imagePublicId: body.imagePublicId || '', imageResourceType: body.imageResourceType || '', video: body.video || '', videoPublicId: body.videoPublicId || '', videoResourceType: body.videoResourceType || '', published: true, createdAt: new Date() };
    const client = await db;
    const result = await client.db(process.env.MONGODB_DB).collection('content').insertOne(item);
    return NextResponse.json({ success: true, ok: true, item: { ...item, _id: result.insertedId.toString() } });
  } catch (error) {
    console.error('[v0] Admin content POST failed:', error);
    return jsonError('تعذر نشر المحتوى');
  }
}

export async function DELETE(req) {
  try {
    if (!(await guard())) return jsonError('غير مصرح', 401);
    const id = new URL(req.url).searchParams.get('id');
    if (!id || !ObjectId.isValid(id)) return jsonError('معرف المحتوى غير صحيح', 400);
    const client = await db;
    await client.db(process.env.MONGODB_DB).collection('content').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, ok: true });
  } catch (error) {
    console.error('[v0] Admin content DELETE failed:', error);
    return jsonError('تعذر حذف المحتوى');
  }
}
