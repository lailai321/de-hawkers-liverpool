'use client'
import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function MobileCartBar() {
  const count = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const totalCents = useCartStore(s => s.items.reduce((sum, i) => {
    const extras = (i.extraMeat ? 300 : 0) + (i.extraVegetable ? 300 : 0) + (i.optionExtrasCents ?? 0)
    return sum + (Math.round(i.price * 100) + extras) * i.quantity
  }, 0))
  const openCart = useCartStore(s => s.openCart)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile || count === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      padding: '10px 16px calc(env(safe-area-inset-bottom, 8px) + 10px)',
      background: 'linear-gradient(to top, rgba(255,252,247,1) 60%, transparent)',
      zIndex: 95,
    }}>
      <button
        onClick={openCart}
        aria-label={`View cart, ${count} item${count > 1 ? 's' : ''}, total $${(totalCents / 100).toFixed(2)}`}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          background: '#B63A24', color: '#FFFFFF',
          border: 'none', borderRadius: 50,
          padding: '15px 22px',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(182,58,36,0.40)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#8F2C1B'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#B63A24'}
      >
        <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem' }}>
          View Cart
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.25)', borderRadius: 50,
          minWidth: 26, height: 26, padding: '0 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem',
        }}>
          {count}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem' }}>
          ${(totalCents / 100).toFixed(2)}
        </span>
      </button>
    </div>
  )
}
