import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    id: '/admin',
    name: "De Hawker's Admin",
    short_name: 'DH Admin',
    description: "De Hawker's Liverpool order and menu management.",
    start_url: '/admin',
    scope: '/admin/',
    display: 'standalone',
    background_color: '#BA3A13',
    theme_color: '#BA3A13',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/admin-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  })
}
