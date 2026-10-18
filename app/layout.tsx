import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Thailand Fieldnotes — Bangkok & Chiang Mai',
  description: 'A researched registry of things to do, eat and explore in Bangkok and Chiang Mai. Compare ideas and build your own December shortlist.',
};
export default function RootLayout({ children }: {children: React.ReactNode}) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
