import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Current Offers | De Hawker's Liverpool",
  description: "See current deals and promo codes for online hawker-style takeaway orders at De Hawker's Liverpool, Westfield Liverpool.",
}

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return children
}
