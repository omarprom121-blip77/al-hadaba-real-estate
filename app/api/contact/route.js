import { NextResponse } from 'next/server';
import db from '../../../lib/db';

const clean = (value, max) => typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, max) : '';

export async function POST(req) {
  try {
    const body = await req.json();
    const name = clean(body.name, 100);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160);
    const service = clean(body.service, 80);
    const message = clean(body.message, 2000);
    if (!name || !phone || !message || !/^[0-9+()\s-]{7,40}$/.test(phone)) return NextResponse.json({ error: 'يرجى إدخال الاسم ورقم هاتف صحيح والرسالة.' }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح.' }, { status: 400 });
    if (service && !['مقاولات عامة', 'حفر وبناء', 'تشطيب كامل'].includes(service)) return NextResponse.json({ error: 'نوع الخدمة غير صحيح.' }, { status: 400 });
    const client = await db;
    await client.db(process.env.MONGODB_DB).collection('contacts').insertOne({ name, phone, email, service, message, status: 'unread', createdAt: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Contact submission failed:', error?.message || 'unknown error');
    return NextResponse.json({ error: 'تعذر حفظ الرسالة حاليًا. حاول مرة أخرى.' }, { status: 500 });
  }
}
