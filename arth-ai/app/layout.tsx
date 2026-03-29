import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Arth AI', template: '%s · Arth AI' },
  description: 'AI-powered hand therapy for arthritis and physical rehabilitation. Real-time ROM monitoring, guided exercises, and servo-assisted movement.',
  keywords: ['arthritis', 'hand therapy', 'rehabilitation', 'AI', 'ROM', 'servo glove'],
  openGraph: {
    title: 'Arth AI',
    description: 'AI-powered hand therapy for arthritis and physical rehabilitation.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg text-muted font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
