import type { Metadata } from 'next';
import { Anton, IBM_Plex_Mono, Inter } from 'next/font/google';
import { PathPrefixProvider } from '@/components/PathPrefixProvider';
import { getIngressPrefix } from '@/lib/ingress.server';
import './globals.css';

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NotOnlyHere',
  description: 'Peer-support community platform',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathPrefix = await getIngressPrefix();

  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable} ${inter.variable} font-mono bg-background-50 text-foreground-950`}>
        <PathPrefixProvider prefix={pathPrefix}>{children}</PathPrefixProvider>
      </body>
    </html>
  );
}
