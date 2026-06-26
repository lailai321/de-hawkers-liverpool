import Image from 'next/image'
import type { MenuCategory, MenuItem } from '@/types'

const FEATURED: string[] = [
  '243059bd-1489-4100-8d2a-3e48375a5996', // Honey Chicken
  '117ae460-e536-451c-9fae-f862f38e5c3a', // Mongolian Beef
  '3ab44f0f-a62d-4bf9-a80e-bdf35d2e22ec', // Singapore Noodles
  '8ae5d125-cc86-494d-8571-63e6a915c5d3', // Chow Mein
  '1fe87753-1990-486d-bce1-33ad1623e8da', // Laksa Soup
  '90703dda-6f4b-4da7-86fc-95f5bb01289b', // Nasi Goreng
  'b112938c-8f8f-4516-b729-342312694cde', // Crispy Chicken
  '6182c48a-4616-4be5-9009-cd04a614924e', // Beef Brisket
]

export default function FeaturedDishes({ categories, onSelect }: {
  categories: MenuCategory[]
  onSelect: (item: MenuItem) => void
}) {
  const byUuid = new Map(categories.flatMap(c => c.items).map(i => [i.uuid, i]))
  const dishes = FEATURED.map(uuid => byUuid.get(uuid)).filter(Boolean) as MenuItem[]
  if (dishes.length === 0) return null

  return (
    <section className="featured-board" aria-label="Today's Picks">
      {/* Brand watermark — decorative only */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-24px', bottom: '-24px',
        zIndex: 0, opacity: 0.10, pointerEvents: 'none', userSelect: 'none',
      }}>
        <Image
          src="/brand/logo-emblem-white.png"
          alt=""
          width={240}
          height={240}
          style={{ objectFit: 'contain', display: 'block' }}
        />
      </div>
      <div className="featured-board-inner" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section heading */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 4vw, 2rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.01em',
            lineHeight: 1.15,
            marginBottom: 4,
          }}>
            Today&apos;s Picks
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem',
            color: '#F4C76B',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}>
            招牌精选
          </p>
        </div>

        <div className="featured-grid hide-scrollbar">
          {dishes.map(item => (
            <button
              key={item.uuid}
              onClick={() => onSelect(item)}
              aria-label={`${item.name} — $${item.price.toFixed(2)}, add to order`}
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.20)',
                borderRadius: 14,
                padding: '14px 12px 16px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.15s, transform 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              }}
            >
              {/* Food photo — outer circle clips, inner div zooms without pixel-blur */}
              <div className="feat-img-wrap" style={{
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.12)',
                flexShrink: 0,
                boxShadow: '0 4px 20px rgba(33,26,23,0.35)',
                position: 'relative',
              }}>
                {item.imageUrl ? (
                  /* Inner wrapper is 148% of outer → zooms into food without CSS upscale blur */
                  <div style={{
                    position: 'absolute',
                    width: '148%', height: '148%',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -48%)',
                  }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center 50%' }}
                      sizes="(max-width: 640px) 210px, 240px"
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem',
                    fontFamily: "'DM Sans', sans-serif", textAlign: 'center',
                  }}>
                    Photo<br/>coming soon
                  </div>
                )}
              </div>

              {/* Name */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.875rem',
                color: '#FFFFFF',
                lineHeight: 1.3,
                margin: 0,
              }}>
                {item.name}
              </p>

              {/* Price tag */}
              <span style={{
                background: '#F4C76B',
                color: '#211A17',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '3px 10px',
                borderRadius: '20px',
              }}>
                ${item.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
