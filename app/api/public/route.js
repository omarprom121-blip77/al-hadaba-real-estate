import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const client = await db;
    const c = client.db(process.env.MONGODB_DB).collection('content');
    const [projects, investments, finishing, comments] = await Promise.all([
      c.find({ type: 'projects', published: true }).sort({ createdAt: -1 }).limit(6).toArray(),
      c.find({ type: 'investments', published: true }).sort({ createdAt: -1 }).limit(6).toArray(),
      c.find({ type: 'finishing', published: true }).sort({ createdAt: -1 }).limit(12).toArray(),
      client.db(process.env.MONGODB_DB).collection('comments').find({ status: 'approved' }).sort({ createdAt: -1 }).limit(12).toArray(),
    ]);
    const clean = items => items.map(({ _id, ...item }) => ({ ...item, _id: _id.toString() }));
    return NextResponse.json({ success: true, projects: clean(projects), investments: clean(investments), finishing: clean(finishing), comments: clean(comments) });
  } catch (error) {
    console.error('[v0] Public API failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر تحميل المحتوى' }, { status: 500 });
  }
}
