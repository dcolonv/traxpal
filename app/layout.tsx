import clsx from 'clsx';
import { type Metadata } from 'next';
import { Chakra_Petch, Inter, Lexend } from 'next/font/google';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s - TraxPal',
    default: 'TraxPal - Accounting made simple for businesses',
  },
  description:
    'Most bookkeeping software is accurate, but hard to use. We make it simple',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const chakra = Chakra_Petch({
  subsets: ['latin'],
  display: 'swap',
  weight: '600',
  variable: '--font-chakra',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
        chakra.variable,
      )}
    >
      <body className="h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
