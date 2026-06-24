import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Track Your Order | De Hawker's Liverpool",
  description: "Check the status of your De Hawker's Liverpool pickup order by entering your phone number.",
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children
}
