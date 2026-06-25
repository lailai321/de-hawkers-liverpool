import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

// Placeholder until a custom domain is connected (Phase E) — update once the
// Vercel project URL is known.
const SITE_URL = 'https://de-hawkers-liverpool.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "De Hawker's Liverpool | Asian Hawker Wok Restaurant, Westfield Liverpool",
  description: "Order hawker-style wok dishes online for pickup at Westfield Liverpool. Fried rice, stir-fried noodles, noodle soups and Chief's Special rice plates — fast pickup, no delivery app fees.",
  keywords: [
    'Asian restaurant Liverpool NSW',
    'wok restaurant Liverpool',
    'hawker food Liverpool',
    'Westfield Liverpool food court',
    'fried rice takeaway Liverpool',
    'laksa Liverpool NSW',
    'noodle soup Liverpool',
    'Chinese takeaway Liverpool NSW',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE_URL,
    siteName: "De Hawker's Liverpool",
    title: "De Hawker's Liverpool | Asian Hawker Wok Restaurant, Westfield Liverpool",
    description: "Order hawker-style wok dishes online for pickup at Westfield Liverpool. Fried rice, stir-fried noodles, noodle soups and Chief's Special rice plates.",
    images: [{ url: '/banner.png', width: 1200, height: 630, alt: "De Hawker's Liverpool, Westfield Liverpool" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "De Hawker's Liverpool | Asian Hawker Wok Restaurant, Westfield Liverpool",
    description: 'Order hawker-style wok dishes online for pickup at Westfield Liverpool.',
    images: ['/banner.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: "De Hawker's Liverpool",
  image: `${SITE_URL}/banner.png`,
  url: SITE_URL,
  telephone: '+61420226788',
  servesCuisine: ['Asian', 'Chinese', 'Malaysian', 'Thai', 'Indonesian'],
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop 1011, Westfield Liverpool, Elizabeth St',
    addressLocality: 'Liverpool',
    addressRegion: 'NSW',
    postalCode: '2170',
    addressCountry: 'AU',
  },
  areaServed: [
    { '@type': 'Place', name: 'Liverpool' },
    { '@type': 'Place', name: 'Sydney' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Thursday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  menu: SITE_URL,
  acceptsReservations: 'False',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
