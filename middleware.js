import {NextResponse} from 'next/server';import {verify} from './lib/auth';
export function middleware(req){if(req.nextUrl.pathname.startsWith('/admin')){const token=req.cookies.get('admin_token')?.value;if(!verify(token))return NextResponse.redirect(new URL('/login',req.url));}return NextResponse.next()}
export const config={matcher:['/admin/:path*']};