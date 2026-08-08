import type { Metadata } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import './globals.css';

// ============================================================================
//  AERION Command Center - Root Layout with Transparent Vector Icon
// ============================================================================

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'AERION | Live Telemetry Command Center',
  description:
    'Live telemetry dashboard for AERION — Atmospheric Energy Recovery through Ionic-Engineered Cellulose. Real-time monitoring of energy harvesting, environmental sensors, and system status.',
  keywords: ['AERION', 'telemetry', 'IoT', 'energy harvesting', 'ESP32', 'dashboard'],
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logo.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`
          ${outfit.variable} ${spaceMono.variable}
          font-display
          bg-[var(--color-bg)] text-[var(--color-text)]
          overflow-x-hidden
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
