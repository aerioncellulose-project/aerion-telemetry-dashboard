import type { Metadata } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import './globals.css';

// ============================================================================
//  AERION Command Center - Root Layout
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
  title: 'AERION | Command Center',
  description:
    'Live telemetry dashboard for AERION — Atmospheric Energy Recovery through Ionic-Engineered Cellulose. Real-time monitoring of energy harvesting, environmental sensors, and system status.',
  keywords: ['AERION', 'telemetry', 'IoT', 'energy harvesting', 'ESP32', 'dashboard'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${outfit.variable} ${spaceMono.variable}
          font-display
          bg-[#050507] text-[#f1f5f9]
          overflow-x-hidden
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
