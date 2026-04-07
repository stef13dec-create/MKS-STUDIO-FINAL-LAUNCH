import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TransitionProvider } from '@/components/TransitionProvider';
import { LanguageProvider } from "@/contexts/LanguageContext";
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'MKS Studio | Commercial Interiors',
  description: 'Ultra-modern, highly visual, high-end minimalist commercial interiors portfolio.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#141414',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#141414] text-[#E4E3E0] cursor-none selection:bg-[#E4E3E0] selection:text-[#141414]" suppressHydrationWarning>
        <ErrorBoundary>
          <LanguageProvider>
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
