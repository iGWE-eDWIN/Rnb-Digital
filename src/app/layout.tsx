import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'RnB Digitals - Premium Print, Branding & Digital Solutions | Port Harcourt, Nigeria',
  description:
    'RnB Digitals is Port Harcourt’s premier branding, large format printing, custom apparel embroidery, branded merchandise, and digital web development agency. Quality that elevates your brand.',
  keywords: [
    'RnB Digitals',
    'Port Harcourt Printing Press',
    'Large Format Printing Port Harcourt',
    'Custom T-Shirt Printing Nigeria',
    'Embroidery Services Nigeria',
    'Branded Merchandise Port Harcourt',
    'Branded Wrapping Tissue Paper',
    'Logo Design Nigeria',
    'Web Development Port Harcourt',
  ],
  authors: [{ name: 'RnB Digitals' }],
  openGraph: {
    title: 'RnB Digitals - Premium Print Solutions',
    description: 'Your Brand Deserves to Be Seen. Premium print, custom apparel, and branding solutions.',
    url: 'https://rnbdigitals.com',
    siteName: 'RnB Digitals',
    locale: 'en_NG',
    type: 'website',
  },
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface font-sans antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
