import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: "De Hawker's Admin",
  description: "De Hawker's Liverpool order and menu management.",
  manifest: '/admin/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'DH Admin',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/admin-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#BA3A13',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
