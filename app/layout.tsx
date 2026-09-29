import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Taslimah Woli — Documentary Photography',
  description: 'Documentary photographer based in Nigeria. Spatial research and documentary photography exploring people, architecture, and inhabited spaces.',
  openGraph: {
    title: 'Taslimah Woli — Documentary Photography',
    description: 'Documentary photographer based in Nigeria. Spatial research and documentary photography exploring people, architecture, and inhabited spaces.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taslimah Woli — Documentary Photography',
    description: 'Documentary photographer based in Nigeria. Spatial research and documentary photography exploring people, architecture, and inhabited spaces.',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-[#eeefef] text-[#18191b] font-sans antialiased selection:bg-[#18191b] selection:text-[#eeefef]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
