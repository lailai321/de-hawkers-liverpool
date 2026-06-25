import { DishCard } from '@/components/ds/menu/DishCard'
import { PriceStar } from '@/components/ds/core/PriceStar'
import { SectionHeader } from '@/components/ds/menu/SectionHeader'
import type { MenuCategory, MenuItem } from '@/types'

// Curated by the owner, not auto-picked — swap uuids here as the signature
// lineup changes. Each gets its own fixed tilt so the price stars read as
// hand-stuck onto a stall board rather than a machine-aligned grid.
const FEATURED: { uuid: string; tilt: number }[] = [
  { uuid: '243059bd-1489-4100-8d2a-3e48375a5996', tilt: -8 },  // Honey Chicken
  { uuid: '117ae460-e536-451c-9fae-f862f38e5c3a', tilt: 6 },   // Mongolian Beef
  { uuid: '3ab44f0f-a62d-4bf9-a80e-bdf35d2e22ec', tilt: -4 },  // Singapore Noodles
  { uuid: '8ae5d125-cc86-494d-8571-63e6a915c5d3', tilt: 9 },   // Chow Mein
  { uuid: '1fe87753-1990-486d-bce1-33ad1623e8da', tilt: -6 },  // Laksa Soup
  { uuid: '90703dda-6f4b-4da7-86fc-95f5bb01289b', tilt: 5 },   // Nasi Goreng
  { uuid: 'b112938c-8f8f-4516-b729-342312694cde', tilt: -9 },  // Crispy Chicken w/ Rice
  { uuid: '6182c48a-4616-4be5-9009-cd04a614924e', tilt: 7 },   // Beef Brisket
]

export default function FeaturedDishes({ categories, onSelect }: {
  categories: MenuCategory[]
  onSelect: (item: MenuItem) => void
}) {
  const byUuid = new Map(categories.flatMap(c => c.items).map(i => [i.uuid, i]))
  const dishes = FEATURED.map(f => ({ ...f, item: byUuid.get(f.uuid) })).filter(d => d.item)
  if (dishes.length === 0) return null

  return (
    <div className="featured-board">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 56px' }}>
        <SectionHeader title="Today's Picks" titleCn="招牌精选" style={{ marginBottom: 28 }} />
        <div className="featured-grid">
          {dishes.map(({ item, tilt }) => item && (
            <div key={item.uuid} style={{ cursor: 'pointer' }} onClick={() => onSelect(item)}>
              <DishCard
                image={item.imageUrl ?? undefined}
                name={item.name}
                price={undefined}
                style={{ paddingBottom: 8 }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: -22 }}>
                <PriceStar price={`$${item.price.toFixed(2)}`} size={64} style={{ transform: `rotate(${tilt}deg)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .featured-board {
          position: relative;
          background: var(--brand);
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px 18px;
        }
        .featured-board::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -10px;
          height: 20px;
          background-image: radial-gradient(circle, var(--bg) 9px, transparent 9.5px);
          background-size: 30px 20px;
          background-position: 15px center;
          background-repeat: repeat-x;
        }
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .featured-grid {
            grid-template-columns: none;
            grid-auto-flow: column;
            grid-auto-columns: 62vw;
            overflow-x: auto;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </div>
  )
}
