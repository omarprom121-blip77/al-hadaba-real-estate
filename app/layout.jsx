import './globals.css';

export const metadata = {
  title: 'عقارات الهضبة',
  description: 'عقارات الهضبة — أفضل الفرص العقارية والاستثمارية.',
  openGraph: { title: 'عقارات الهضبة', description: 'أفضل الفرص العقارية والاستثمارية.' }
};

export default function RootLayout({ children }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
