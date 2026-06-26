'use client'
import { useEffect, useRef } from 'react'
import { MenuCategory } from '@/types'

interface Props {
  categories: MenuCategory[]
  activeSlug: string
  onSelect: (slug: string) => void
}

export default function CategoryNav({ categories, activeSlug, onSelect }: Props) {
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = navRef.current
    const el = container?.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement
    if (!container || !el) return
    const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
    container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [activeSlug])

  return (
    <div
      ref={navRef}
      className="hide-scrollbar"
      role="list"
      aria-label="Menu categories"
      style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 14px' }}
    >
      {categories.map(cat => {
        const active = activeSlug === cat.slug
        return (
          <button
            key={cat.slug}
            data-slug={cat.slug}
            role="listitem"
            onClick={() => onSelect(cat.slug)}
            aria-current={active ? 'true' : undefined}
            aria-label={`Jump to ${cat.name} category`}
            style={{
              whiteSpace: 'nowrap',
              padding: '10px 18px',
              borderRadius: 50,
              border: active ? 'none' : '1.5px solid #E7C3B5',
              background: active ? '#B63A24' : '#FFFFFF',
              color: active ? '#FFFFFF' : '#211A17',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem',
              fontWeight: active ? 700 : 500,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              flexShrink: 0,
              minHeight: 44,
              boxShadow: active ? '0 2px 8px rgba(182,58,36,0.25)' : 'none',
            }}
            onMouseEnter={e => {
              if (!active) {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#F5EBE6'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#B63A24'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#E7C3B5'
              }
            }}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
