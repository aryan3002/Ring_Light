import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { LightProvider } from '@/context/LightContext';

export const metadata: Metadata = {
  title: 'Glow Up Studio | Professional Ring Light for Creators',
  description:
    'Turn your screen into a professional ring light. Adjustable color temperature, brightness controls, and custom presets for content creators.',
  keywords: ['ring light', 'content creation', 'screen light', 'studio lighting', 'webcam light'],
  openGraph: {
    title: 'Glow Up Studio',
    description: 'Turn your screen into a professional ring light for content creation.',
    type: 'website',
    siteName: 'Glow Up Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow Up Studio',
    description: 'Turn your screen into a professional ring light for content creation.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#FF006E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="noise-overlay">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LightProvider>
          <div id="main-content">{children}</div>
        </LightProvider>
      </body>
    </html>
  );
}
