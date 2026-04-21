import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import PWAUpdater from '@/components/PWAUpdater';

export const metadata: Metadata = {
  title: 'TINKAZO - Pronósticos Deportivos',
  description: 'La arena definitiva para los pronosticadores más audaces. Domina las jornadas, crea tu jugada maestra y conquista premios legendarios.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TINKAZO',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/icons/icon-96.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-900 text-white">
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
          <PWAUpdater />
        </AppProvider>
      </body>
    </html>
  );
}
