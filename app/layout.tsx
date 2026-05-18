import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LangProvider } from '@/components/LangProvider';
import Cursor from '@/components/Cursor';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Josue Bravo — UX/UI & Interaction Design Lead',
  description: 'Complex problems into clear, human products. Enterprise UX, AI Product Design, CRO. Mexico City · LATAM · US.',
  keywords: ['UX Design', 'UI Design', 'Interaction Design', 'AI Product Design', 'Enterprise UX', 'CRO'],
  authors: [{ name: 'Josue Bravo', url: 'https://josuebravodi.dev' }],
  openGraph: {
    title: 'Josue Bravo — UX/UI & Interaction Design Lead',
    description: 'The most valuable design impact starts before the first screen.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <SmoothScroll>
              <Cursor />
              {children}
            </SmoothScroll>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
