import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';
import { verify } from '../../../../lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    const cookieStore = await cookies();
    const admin = verify(cookieStore.get('admin_token')?.value);
    if (admin?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'al-hadaba';
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, process.env.CLOUDINARY_API_SECRET);

    return NextResponse.json({
      success: true,
      timestamp,
      signature,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error('[v0] Signature generation failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر تجهيز رفع الملف' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'استخدم POST' }, { status: 405 });
}
