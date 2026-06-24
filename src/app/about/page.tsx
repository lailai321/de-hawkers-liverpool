'use client'
import Image from 'next/image'
import { Utensils, Leaf, Users } from 'lucide-react'

const R = { fontFamily: "'Baloo 2', sans-serif" } as const
const F = { fontFamily: "'Nunito Sans', sans-serif" } as const

const locations = [
  {
    name: "De Hawker's – Liverpool",
    address: 'Shop 1011, Westfield Liverpool\nElizabeth St, Liverpool NSW 2170',
    phone: '0420 226 788',
    hours: 'Mon–Wed, Fri–Sun 9:00am–6:00pm · Thu 9:00am–9:00pm',
    hasOrder: true,
    image: '/glenmore-park.jpg',
    imgPosition: 'right top',
  },
]

const sellingPoints = [
  { icon: <Utensils size={22} color="#BA3A13" strokeWidth={1.8} />, label: 'Hawker-Style Wok Cooking' },
  { icon: <Leaf size={22} color="#BA3A13" strokeWidth={1.8} />, label: 'Build Your Own Dish' },
  { icon: <Users size={22} color="#BA3A13" strokeWidth={1.8} />, label: 'Westfield Liverpool' },
]

const storyParagraphs = [
  `De Hawker's brings the energy of an Asian hawker market to Westfield Liverpool — fried rice, stir-fried noodles, noodle soups and our Chief's Special rice plates, all cooked to order in the wok.`,
  `Add your star ingredient: build your bowl with vegetables, chicken, beef, a combination, seafood or king prawn, laddered up from our base price so you only pay for what you choose.`,
  `From Singapore noodles and Pad Thai to laksa and honey chicken, our menu draws on the hawker traditions of Malaysia, Thailand, Indonesia and Southern China — fast, fresh and made for pickup.`,
]

export default function AboutPage() {
  return (
    <div style={{ background: '#FFF', minHeight: '100svh' }}>

      {/* Hero */}
      <div style={{ background: '#FFFFFF', padding: '56px 24px 40px', textAlign: 'center', width: '100%' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ ...R, fontSize: 'clamp(48px, 8vw, 80px)', color: '#2A1A12', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: 12 }}>
            De Hawker&apos;s
          </h1>
          <p style={{ ...F, fontSize: '1rem', color: '#856F63', letterSpacing: '0.04em' }}>
            Add Your Star Ingredient
          </p>
        </div>
      </div>

      {/* Story + Images side by side */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 56px' }}>

        {/* Section heading */}
        <div style={{ background: '#BA3A13', display: 'inline-block', padding: '10px 20px', borderRadius: 4, marginBottom: 32 }}>
          <h2 style={{ ...R, fontSize: '1.6rem', color: '#2A1A12', letterSpacing: '0.04em', margin: 0 }}>Our Story</h2>
        </div>

        {/* Two-column: text left, images right */}
        <div className="story-grid">
          {/* Text */}
          <div className="story-text">
            {storyParagraphs.map((para, i) => (
              <p key={i} style={{ ...F, fontSize: '0.95rem', color: '#2A1A12', lineHeight: 1.9, marginBottom: 24 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Images */}
          <div className="story-images" style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 0 }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden' }}>
              <Image src="/about-img1.webp" alt="Our food" fill style={{ objectFit: 'cover' }} unoptimized />
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden' }}>
              <Image src="/about-img2.webp" alt="Our kitchen" fill style={{ objectFit: 'cover' }} unoptimized />
            </div>
          </div>
        </div>

        {/* Selling points */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16, marginTop: 40 }}>
          {sellingPoints.map(({ icon, label }) => (
            <div key={label}
              className="selling-point"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#F6ECDF', borderRadius: 10, padding: '14px 22px',
                border: '1px solid #F7DDD2',
                transition: 'box-shadow 0.18s, transform 0.18s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              {icon}
              <span style={{ ...F, fontWeight: 700, fontSize: '0.95rem', color: '#2A1A12' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div style={{ background: '#F6ECDF', padding: '56px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: '#BA3A13', display: 'inline-block', padding: '10px 20px', borderRadius: 4, marginBottom: 32 }}>
            <h2 style={{ ...R, fontSize: '1.6rem', color: '#2A1A12', letterSpacing: '0.04em', margin: 0 }}>Our Locations</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {locations.map((loc, i) => (
              <div key={i} className="location-card" style={{ background: '#FFF', borderRadius: 12, border: '1px solid #F7DDD2', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '45%', flexShrink: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {loc.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loc.image} alt={loc.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  ) : (
                    <div style={{
                      width: '100%', minHeight: 220,
                      background: 'linear-gradient(135deg, #F0F0F0 0%, #E5E5E5 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#BBB', fontSize: '0.75rem', ...F,
                    }}>
                      Store Photo
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ ...R, fontSize: '1.4rem', color: '#2A1A12', letterSpacing: '0.04em', lineHeight: 1.2 }}>{loc.name}</h3>
                  <p style={{ ...F, fontSize: '0.875rem', color: '#2A1A12', whiteSpace: 'pre-line' }}>{loc.address}</p>
                  <p style={{ ...F, fontSize: '0.875rem', color: '#BA3A13', fontWeight: 700 }}>{loc.phone}</p>
                  <p style={{ ...F, fontSize: '0.78rem', color: '#666' }}>{loc.hours}</p>
                  {loc.hasOrder && (
                    <a href="/" style={{
                      marginTop: 6, display: 'inline-block', padding: '10px 22px',
                      background: '#BA3A13', color: '#2A1A12', borderRadius: 4,
                      ...R, fontSize: '1rem', letterSpacing: '0.04em', textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#8A2A0D')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#BA3A13')}
                    >
                      Order Pickup
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .story-grid {
          display: flex;
          gap: 48px;
          align-items: start;
        }
        .story-text { flex: 55; min-width: 0; padding-top: 0; }
        .story-images { flex: 40; min-width: 0; padding-top: 0; }

        @media (max-width: 768px) {
          .story-grid { flex-direction: column; gap: 28px; }
          .story-images { width: 100%; }
        }

        @media (max-width: 600px) {
          .location-card { flex-direction: column !important; }
          .location-card > div:first-child { width: 100% !important; }
        }
      `}</style>
    </div>
  )
}
