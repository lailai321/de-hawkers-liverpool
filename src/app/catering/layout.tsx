import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Catering Enquiry | De Hawker's Liverpool",
  description: "Planning an event in Liverpool, Sydney? Enquire about hawker-style catering from De Hawker's — fried rice, stir-fried noodles, honey chicken and more for groups.",
}

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return children
}
