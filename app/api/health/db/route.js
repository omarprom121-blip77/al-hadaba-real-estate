import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (typeof uri !== 'string' || uri.trim().length === 0 || uri.includes('USERNAME:PASSWORD')) {
    return NextResponse.json({ mongodbUri: 'MISSING', mongodbConnection: 'BLOCKED' }, { status: 503 });
  }

  try {
    const client = await db;
    await client.db(process.env.MONGODB_DB || 'al_hadaba').command({ ping: 1 });
    return NextResponse.json({ mongodbUri: 'PRESENT', mongodbConnection: 'SUCCESS' });
  } catch (error) {
    console.error('[v0] MongoDB health check failed:', error?.message || 'unknown error');
    return NextResponse.json({ mongodbUri: 'PRESENT', mongodbConnection: 'BLOCKED' }, { status: 503 });
  }
}
