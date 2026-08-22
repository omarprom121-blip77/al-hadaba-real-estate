import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';

const json = (body, status = 200) => NextResponse.json(body, { status });

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) return json({ success: false, error: 'PROJECT_NOT_FOUND' }, 404);
    const client = await db;
    const item = await client.db(process.env.MONGODB_DB).collection('content').findOne({ _id: new ObjectId(id), type: 'projects', published: true });
    if (!item) return json({ success: false, error: 'PROJECT_NOT_FOUND' }, 404);
    return json({ success: true, project: { ...item, _id: item._id.toString(), id: item._id.toString() } });
  } catch (error) {
    console.error('[v0] Project details API failed:', error);
    return json({ success: false, error: 'SERVER_ERROR' }, 500);
  }
}
