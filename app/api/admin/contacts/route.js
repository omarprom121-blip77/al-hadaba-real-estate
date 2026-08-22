import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { verify } from '../../../../lib/auth';
import db from '../../../../lib/db';

async function guard() {
  const store = await cookies();
  return verify(store.get('admin_token')?.value)?.role === 'admin';
}

const serialize = (item) => ({ ...item, _id: item._id.toString(), createdAt: item.createdAt?.toISOString?.() || item.createdAt });

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const client = await db;
  const messages = await client.db(process.env.MONGODB_DB).collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ messages: messages.map(serialize), unread: messages.filter((item) => item.status === 'unread').length });
}

export async function PATCH(req) {
  if (!(await guard())) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const { id, status } = await req.json();
  if (!ObjectId.isValid(id) || !['read', 'unread'].includes(status)) return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
  const client = await db;
  await client.db(process.env.MONGODB_DB).collection('contacts').updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  if (!(await guard())) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'معرّف غير صحيح' }, { status: 400 });
  const client = await db;
  await client.db(process.env.MONGODB_DB).collection('contacts').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
