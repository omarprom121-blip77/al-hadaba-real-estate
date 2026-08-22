import './globals.css';
import WhatsAppButton from '../components/whatsapp-button';

export const metadata = {
  title: 'شركة عقارات الهضبة',
  description: 'شركة عقارات الهضبة للمقاولات العامة والحفر والبناء والتشطيب الكامل.',
  icons: {
    icon: [{ url: '/al-hadaba-logo.png', type: 'image/png' }],
    apple: [{ url: '/al-hadaba-logo.png', type: 'image/png' }],
  },
  openGraph: { title: 'شركة عقارات الهضبة', description: 'مقاولات عامة وحفر وبناء وتشطيب كامل بأعلى معايير الجودة.' }
};

export default function RootLayout({ children }) {
  return <html lang="ar" dir="rtl"><body>{children}<WhatsAppButton /></body></html>;
}
