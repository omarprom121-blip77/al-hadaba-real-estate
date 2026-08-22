import './globals.css';
import WhatsAppButton from '../components/whatsapp-button';

export const metadata = {
  title: 'عقارات الهضبة',
  description: 'عقارات الهضبة — أفضل الفرص العقارية والاستثمارية.',
  openGraph: { title: 'عقارات الهضبة', description: 'أفضل الفرص العقارية والاستثمارية.' }
};

export default function RootLayout({ children }) {
  return <html lang="ar" dir="rtl"><body>{children}<WhatsAppButton /></body></html>;
}
