# عقارات الهضبة

A production-oriented Arabic RTL real-estate website using Next.js, MongoDB Atlas, JWT admin authentication, and Cloudinary media uploads.

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set MongoDB Atlas credentials.
5. Set a strong `JWT_SECRET`.
6. Set `ADMIN_PHONE=01154833016`.
7. Choose your own `ADMIN_PASSWORD`.
8. Set Cloudinary credentials for image/video uploads.
9. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
10. Run `npm run dev`.

## Admin
Go to `/login`. Use the admin phone and password from `.env.local`.

## Media
The dashboard uploads images/videos to Cloudinary and inserts the returned URL into content.

## Important
Replace `public/hero-placeholder.svg` with your real background image or change the hero background path in `app/globals.css`. Replace the placeholder logo mark in the navbar with the official logo asset when supplied.

## Production
Recommended deployment:
- App: Vercel
- Database: MongoDB Atlas
- Media: Cloudinary
- Source: GitHub

Set the same environment variables in the hosting provider.
