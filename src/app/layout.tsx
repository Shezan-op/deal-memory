import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'DealMemory — Outcome-Learning Deal Intelligence via Hindsight',
  description:
    'Every sales conversation becomes experience the next conversation can learn from. Powered by Hindsight.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FBFBFA] text-[#111111]">
        <Navigation />
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
