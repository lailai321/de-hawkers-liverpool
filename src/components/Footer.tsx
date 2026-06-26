import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Phone } from 'lucide-react'

const F = { fontFamily: "'DM Sans', sans-serif" } as const
const R = { fontFamily: "'Playfair Display', Georgia, serif" } as const

const NAV = [
  { label: 'Menu',        href: '/' },
  { label: 'About Us',    href: '/about' },
  { label: 'Catering',    href: '/catering' },
  { label: 'Track Order', href: '/track' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#211A17', padding: '52px 40px 36px', color: '#FFF8EF' }} aria-label="Site footer">
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 56, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
          <Image
            src="/brand/logo-emblem-white.png"
            alt="De Hawker's Liverpool"
            width={72}
            height={72}
            style={{ objectFit: 'contain' }}
          />
          <div>
            <p style={{ ...R, fontSize: '1.25rem', fontWeight: 700, color: '#FFF8EF', letterSpacing: '0.01em', lineHeight: 1.15 }}>
              De Hawker&apos;s
            </p>
            <p style={{ ...F, fontSize: '0.75rem', color: '#F4C76B', fontWeight: 600, letterSpacing: '0.08em', marginTop: 3 }}>
              LIVERPOOL
            </p>
          </div>
        </div>

        {/* Contact */}
        <address style={{ fontStyle: 'normal', flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 220 }}>
          <a
            href="https://maps.google.com/?q=Shop+1011+Westfield+Liverpool+Elizabeth+St+Liverpool+NSW+2170"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'flex-start', gap: 8, ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.72)', textDecoration: 'none', lineHeight: 1.55 }}
          >
            <MapPin size={14} strokeWidth={2} style={{ color: '#F4C76B', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <span>Shop 1011, Westfield Liverpool<br />Elizabeth St, Liverpool NSW 2170</span>
          </a>
          <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8, ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.72)', lineHeight: 1.55 }}>
            <Clock size={14} strokeWidth={2} style={{ color: '#F4C76B', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <span>Mon–Wed, Fri–Sun 9am–6pm<br />Thu 9am–9pm</span>
          </span>
          <a href="tel:+61420226788" style={{ display: 'flex', alignItems: 'center', gap: 8, ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.72)', textDecoration: 'none' }}>
            <Phone size={14} strokeWidth={2} style={{ color: '#F4C76B', flexShrink: 0 }} aria-hidden="true" />
            0420 226 788
          </a>
        </address>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }} aria-label="Footer navigation">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{ ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.60)', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>

      {/* Bottom bar */}
      <p style={{ maxWidth: 1200, margin: '28px auto 0', paddingTop: 20, borderTop: '1px solid rgba(231,195,181,0.12)', ...F, fontSize: '0.78rem', color: 'rgba(255,248,239,0.28)' }}>
        © {new Date().getFullYear()} De Hawker&apos;s Liverpool &middot; All rights reserved &middot; Halal Friendly
      </p>
    </footer>
  )
}
