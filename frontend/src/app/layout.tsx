import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'FootTalks — Football Transfer Intelligence',
  description: 'Curated transfer rumors, reliability scores, and market insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#e5e5e5] min-h-screen flex flex-col">
        <Header />
        {/* pt-16 to clear the fixed header */}
        <main className="flex-1 pt-16 pb-16">
          {children}
        </main>
        
        {/* Persistent Footer Disclaimer */}
        <footer className="border-t border-[#2e2e2e] bg-[#0a0a0a] py-6 px-6 text-center">
          <p className="text-xs text-[#555] uppercase tracking-widest font-semibold max-w-3xl mx-auto leading-relaxed">
            Rumor data manually researched and curated for demonstration purposes. Not a live news feed.
          </p>
        </footer>
      </body>
    </html>
  );
}
