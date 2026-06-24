import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us | De Hawker's Liverpool – Westfield Liverpool",
  description: "De Hawker's Liverpool serves hawker-style wok dishes at Westfield Liverpool, Sydney. See our location, hours and contact details.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
