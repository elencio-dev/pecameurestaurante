import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'PeçaMeuRestaurante — Peça. Receba. Aproveite.',
  description: 'A plataforma de delivery mais transparente do Brasil. Apenas R$1,00 por pedido, sem comissões abusivas.',
  keywords: ['delivery', 'restaurante', 'comida', 'pedido online', 'Brasil'],
  authors: [{ name: 'PeçaMeuRestaurante' }],
  openGraph: {
    title: 'PeçaMeuRestaurante',
    description: 'Delivery transparente — R$1,00 por pedido',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2C1A0E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#2C1A0E',
              color: '#FFF8F0',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '100px',
              padding: '10px 20px',
            },
          }}
        />
      </body>
    </html>
  )
}
