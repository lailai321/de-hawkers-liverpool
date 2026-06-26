'use client'
import Image from 'next/image'
import { Plus, Utensils } from 'lucide-react'
import { MenuItem } from '@/types'

interface Props {
  item: MenuItem
  isSoldOut: boolean
  onClick: () => void
  triggerRef?: undefined
}

export default function ItemCard({ item, isSoldOut, onClick }: Props) {
  function handleClick() {
    if (isSoldOut) return
    onClick()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      role="button"
      tabIndex={isSoldOut ? -1 : 0}
      aria-label={`${item.name}${item.price ? `, $${item.price.toFixed(2)}` : ''}${isSoldOut ? ', sold out' : ', tap to add'}`}
      aria-disabled={isSoldOut}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: `1.5px solid ${isSoldOut ? '#EADDD9' : '#E7C3B5'}`,
        boxShadow: '0 2px 10px rgba(182,58,36,0.07)',
        padding: '14px 14px 14px 14px',
        display: 'flex',
        gap: 12,
        cursor: isSoldOut ? 'not-allowed' : 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s',
        position: 'relative',
        opacity: isSoldOut ? 0.75 : 1,
        userSelect: 'none',
        outline: 'none',
      }}
      onMouseEnter={e => {
        if (!isSoldOut) {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(182,58,36,0.14)'
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(182,58,36,0.07)'
      }}
      onFocus={e => {
        if (!isSoldOut) {
          (e.currentTarget as HTMLElement).style.outline = '3px solid #F4C76B'
          ;(e.currentTarget as HTMLElement).style.outlineOffset = '2px'
        }
      }}
      onBlur={e => {
        (e.currentTarget as HTMLElement).style.outline = 'none'
      }}
    >
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: '#211A17',
          lineHeight: 1.35,
          marginBottom: 5,
        }}>
          {item.name}
        </p>

        {item.description && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.8125rem',
            color: '#745F55',
            lineHeight: 1.5,
            marginBottom: 8,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {item.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: '#B63A24',
          }}>
            ${item.price.toFixed(2)}
          </span>

          {isSoldOut && (
            <span className="sold-out-badge" aria-label="This item is sold out">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Image + add button */}
      {item.imageUrl ? (
        <div style={{ position: 'relative', flexShrink: 0, width: 100, height: 100 }}>
          <div style={{ width: 100, height: 100, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100px"
            />
          </div>
          {!isSoldOut && (
            <button
              onClick={e => { e.stopPropagation(); handleClick() }}
              aria-label={`Add ${item.name} to order`}
              tabIndex={-1}
              style={{
                position: 'absolute', right: -6, bottom: -6,
                width: 36, height: 36, borderRadius: '50%',
                background: '#B63A24', color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(182,58,36,0.35)',
                transition: 'background 0.15s, transform 0.12s',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#8F2C1B'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#B63A24'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
              }}
            >
              <Plus size={17} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        /* No image: show placeholder column + add button */
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
          {/* Placeholder */}
          <div style={{
            width: 72, height: 72, borderRadius: 10,
            background: 'linear-gradient(135deg, #FFF0EA 0%, #F5E6DF 100%)',
            border: '1.5px solid #E7C3B5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Utensils size={24} strokeWidth={1.5} color="#B63A24" style={{ opacity: 0.55 }} aria-hidden="true" />
          </div>

          {!isSoldOut && (
            <button
              onClick={e => { e.stopPropagation(); handleClick() }}
              aria-label={`Add ${item.name} to order`}
              tabIndex={-1}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#B63A24', color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', alignSelf: 'flex-end',
                boxShadow: '0 2px 8px rgba(182,58,36,0.35)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#8F2C1B'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#B63A24'}
            >
              <Plus size={17} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </article>
  )
}
