'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Utensils, Leaf, Users, MapPin, Clock, Phone } from 'lucide-react'
import Footer from '@/components/Footer'

const F = { fontFamily: "'DM Sans', sans-serif" } as const
const R = { fontFamily: "'Playfair Display', Georgia, serif" } as const

const locations = [
  {
    name: "De Hawker's – Liverpool",
    address: 'Shop 1011, Westfield Liverpool\nElizabeth St, Liverpool NSW 2170',
    phone: '0420 226 788',
    phoneHref: 'tel:+61420226788',
    mapsHref: 'https://maps.google.com/?q=Shop+1011+Westfield+Liverpool+Elizabeth+St+Liverpool+NSW+2170',
    hours: 'Mon–Wed, Fri–Sun 9am–6pm · Thu 9am–9pm',
    hasOrder: true,
  },
  {
    name: "De Hawker's – Westpoint Blacktown",
    address: 'Floor 3, Westpoint Blacktown\n17 Patrick St, Blacktown NSW 2148',
    phone: 'TBC',
    phoneHref: null,
    mapsHref: null,
    hours: 'Check Google Maps for hours',
    hasOrder: false,
  },
  {
    name: "De Hawker's – Rouse Hill",
    address: 'Rouse Hill Town Centre\nWhite Hart Dr, Rouse Hill NSW 2155',
    phone: 'TBC',
    phoneHref: null,
    mapsHref: null,
    hours: 'Check Google Maps for hours',
    hasOrder: false,
  },
]

const sellingPoints = [
  { icon: <Utensils size={20} color="#B63A24" strokeWidth={1.8} aria-hidden="true" />, label: 'Fresh Wok-Fired' },
  { icon: <Leaf size={20} color="#B63A24" strokeWidth={1.8} aria-hidden="true" />, label: 'Generous Portions' },
  { icon: <Users size={20} color="#B63A24" strokeWidth={1.8} aria-hidden="true" />, label: 'Halal Friendly in Liverpool*' },
]

const storyHeading = `Fresh Wok-Fired Chinese Food with Cantonese Classics & Malaysian Favourites`

const storyParagraphs = [
  `At De Hawker's, every dish is cooked fresh to order over a blazing wok, bringing together the bold flavours of Cantonese classics and Malaysian favourites with the speed and convenience of modern takeaway dining.`,
  `Our menu features customer favourites including Honey Chicken, Mongolian Beef, Stir-Fried Beef Flat Rice Noodles, Laksa, Special Fried Rice, Wonton Noodle Soup and slow-braised Beef Noodle Soup. Whether you're craving a quick lunch, a family dinner or a comforting bowl of noodles, every meal is freshly prepared with generous portions and authentic wok-fired flavour.`,
  `With three locations across Sydney, De Hawker's is committed to serving freshly cooked Chinese food that's full of flavour, made to order and perfect for dine-in, takeaway or online ordering.`,
]

export default function AboutPage() {
  return (
    <>
    <div style={{ background: '#FFF8EF', minHeight: '100svh' }}>

      {/* Hero banner */}
      <div style={{ background: '#161009', padding: '60px 24px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Wok-fire background — decorative, very low opacity */}
        <Image
          src="/about-img1.webp"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%', opacity: 0.14, filter: 'blur(2px) saturate(0.6)' }}
          sizes="100vw"
          aria-hidden="true"
          priority
        />
        {/* Gradient vignette to keep text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 20%, rgba(16,9,0,0.55) 100%)' }} aria-hidden="true" />

        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ ...R, fontSize: 'clamp(2.6rem, 7vw, 3.8rem)', color: '#FFFFFF', letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 16, textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}>
            De Hawker&apos;s
          </h1>
          <p style={{ ...F, fontSize: 'clamp(1rem, 2.4vw, 1.2rem)', color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.02em', marginBottom: 12, lineHeight: 1.3, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
            Fresh Wok-Fired Chinese Food
          </p>
          <p style={{ ...F, fontSize: '0.875rem', color: '#F4C76B', letterSpacing: '0.10em', fontWeight: 500, textTransform: 'uppercase' }}>
            Classic Cantonese &nbsp;·&nbsp; Malaysian Favourites
          </p>
        </div>
      </div>

      {/* Story + Images */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 28px 56px' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#B63A24', padding: '8px 18px', borderRadius: 6, marginBottom: 28 }}>
          <h2 style={{ ...R, fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>Our Story</h2>
        </div>

        <div className="story-grid">
          <div className="story-text">
            <h3 style={{ ...R, fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', color: '#B63A24', fontWeight: 700, lineHeight: 1.3, marginBottom: 20 }}>
              {storyHeading}
            </h3>
            {storyParagraphs.map((para, i) => (
              <p key={i} style={{ ...F, fontSize: '0.95rem', color: '#211A17', lineHeight: 1.85, marginBottom: 22 }}>
                {para}
              </p>
            ))}
            {/* Liverpool halal note */}
            <div style={{
              background: '#FFF0EA', border: '1.5px solid #E7C3B5', borderLeft: '4px solid #B63A24',
              borderRadius: 8, padding: '14px 18px', marginTop: 8,
            }}>
              <p style={{ ...F, fontSize: '0.875rem', color: '#211A17', lineHeight: 1.75, margin: 0 }}>
                <strong>For our Liverpool customers:</strong> De Hawker&apos;s Liverpool offers a halal-friendly menu.
                Please note that halal-friendly dining is available <strong>at our Liverpool location only</strong>.
                Our Blacktown and Rouse Hill locations are not halal-friendly.
              </p>
            </div>
          </div>

          <div className="story-images" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 24px rgba(182,58,36,0.12)' }}>
              <Image src="/about-img1.webp" alt="Our food — wok-cooked hawker dishes" fill style={{ objectFit: 'cover' }} sizes="500px" />
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 24px rgba(182,58,36,0.12)' }}>
              <Image src="/about-img2.webp" alt="Our kitchen" fill style={{ objectFit: 'cover' }} sizes="500px" />
            </div>
          </div>
        </div>

        {/* Selling points */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginTop: 40 }}>
          {sellingPoints.map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#FFFFFF', borderRadius: 50, padding: '12px 22px',
                border: '1.5px solid #E7C3B5',
                boxShadow: '0 2px 8px rgba(182,58,36,0.07)',
              }}
            >
              {icon}
              <span style={{ ...F, fontWeight: 600, fontSize: '0.9rem', color: '#211A17' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div style={{ background: '#211A17', padding: '52px 24px 68px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#B63A24', padding: '8px 18px', borderRadius: 6, marginBottom: 28 }}>
            <h2 style={{ ...R, fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>Our Locations</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {locations.map((loc, i) => (
              <article key={i} className="location-card" style={{
                background: '#2C2218', borderRadius: 14, border: '1px solid rgba(231,195,181,0.15)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                overflow: 'hidden', display: 'flex',
              }}>
                {/* Placeholder image slot */}
                <div style={{ width: '36%', flexShrink: 0, background: '#3A2A1E', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <div style={{ textAlign: 'center', color: 'rgba(231,195,181,0.35)', fontSize: '0.75rem', ...F }}>
                    Photo<br/>coming soon
                  </div>
                </div>

                <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ ...R, fontSize: '1.25rem', color: '#FFF8EF', letterSpacing: '0.01em', lineHeight: 1.2 }}>{loc.name}</h3>

                  {loc.mapsHref ? (
                    <a href={loc.mapsHref} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 6, textDecoration: 'none' }}>
                      <MapPin size={14} color="#F4C76B" strokeWidth={2} style={{ marginTop: 3, flexShrink: 0 }} />
                      <span style={{ ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.80)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{loc.address}</span>
                    </a>
                  ) : (
                    <p style={{ ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.70)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{loc.address}</p>
                  )}

                  {loc.phoneHref ? (
                    <a href={loc.phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...F, fontSize: '0.875rem', color: '#F4C76B', fontWeight: 600, textDecoration: 'none' }}>
                      <Phone size={13} strokeWidth={2} />
                      {loc.phone}
                    </a>
                  ) : (
                    <p style={{ ...F, fontSize: '0.875rem', color: 'rgba(255,248,239,0.45)' }}>{loc.phone}</p>
                  )}

                  <p style={{ display: 'flex', alignItems: 'center', gap: 6, ...F, fontSize: '0.8rem', color: 'rgba(255,248,239,0.55)', margin: 0 }}>
                    <Clock size={13} strokeWidth={2} style={{ flexShrink: 0 }} />
                    {loc.hours}
                  </p>

                  {loc.hasOrder && (
                    <Link href="/" style={{
                      marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 22px', background: '#B63A24', color: '#FFFFFF',
                      borderRadius: 50, ...F, fontSize: '0.9rem', fontWeight: 700,
                      textDecoration: 'none', width: 'fit-content',
                    }}>
                      Order Pickup
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .story-grid { display: flex; gap: 48px; align-items: start; }
        .story-text { flex: 55; min-width: 0; }
        .story-images { flex: 40; min-width: 0; }
        @media (max-width: 768px) {
          .story-grid { flex-direction: column; gap: 24px; }
          .story-images { width: 100%; }
        }
        @media (max-width: 600px) {
          .location-card { flex-direction: column !important; }
          .location-card > div:first-child { width: 100% !important; min-height: 140px !important; }
        }
      `}</style>
    </div>
    <Footer />
    </>
  )
}
