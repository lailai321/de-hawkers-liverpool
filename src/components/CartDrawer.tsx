'use client'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart'

interface Props { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const router = useRouter()
  const { items, updateQuantity, removeItem, totalCents } = useCartStore()

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Your order cart"
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(33,26,23,0.45)', backdropFilter: 'blur(3px)' }} aria-hidden="true" />

      {/* Drawer */}
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px 14px', borderBottom: '1px solid #E7C3B5', flexShrink: 0 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, color: '#211A17', letterSpacing: '0.01em' }}>
            Your Order
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(33,26,23,0.10)', border: 'none',
              color: '#211A17',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(33,26,23,0.18)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(33,26,23,0.10)'}
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        {/* Items */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '4px 22px' }}>
          {items.length === 0 && (
            <p style={{ textAlign: 'center', color: '#B5A399', padding: '52px 0', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
              Your cart is empty
            </p>
          )}

          {items.map((item, i) => {
            const extras = (item.extraMeat ? 300 : 0) + (item.extraVegetable ? 300 : 0) + (item.optionExtrasCents ?? 0)
            const lineTotal = (Math.round(item.price * 100) + extras) * item.quantity
            const hasFlavours = item.flavourSelections && Object.keys(item.flavourSelections).length > 0
            const flavourSummary = hasFlavours
              ? Object.entries(item.flavourSelections!).filter(([, q]) => q > 0).map(([f, q]) => `${f} ×${q}`).join(', ')
              : null
            const optionsSummary = item.optionSelections
              ? Object.values(item.optionSelections).flat().filter(Boolean).join(', ')
              : null

            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', borderBottom: '1px solid #F5EBE6' }}>
                {hasFlavours ? (
                  <div style={{ width: 68, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#211A17' }}>×{item.quantity}</span>
                  </div>
                ) : (
                  <div
                    role="group"
                    aria-label={`Quantity for ${item.name}`}
                    style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E7C3B5', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}
                  >
                    <button
                      onClick={() => updateQuantity(item.uuid, item.extraMeat, item.extraVegetable, item.notes, item.quantity - 1, item.flavourSelections, item.optionSelections)}
                      aria-label={`Decrease ${item.name} quantity`}
                      style={{ width: 30, height: 30, background: '#FFF8EF', border: 'none', color: '#B63A24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={12} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <span aria-live="polite" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#211A17', width: 22, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.uuid, item.extraMeat, item.extraVegetable, item.notes, item.quantity + 1, item.flavourSelections, item.optionSelections)}
                      aria-label={`Increase ${item.name} quantity`}
                      style={{ width: 30, height: 30, background: '#FFF8EF', border: 'none', color: '#B63A24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={12} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#211A17' }}>{item.name}</p>
                  {optionsSummary && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#745F55', marginTop: 2 }}>{optionsSummary}</p>}
                  {flavourSummary && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#745F55', marginTop: 2 }}>{flavourSummary}</p>}
                  {item.extraMeat && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#745F55', marginTop: 2 }}>+ Extra Meat</p>}
                  {item.extraVegetable && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#745F55', marginTop: 2 }}>+ Extra Vegetable</p>}
                  {item.notes && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#B5A399', fontStyle: 'italic', marginTop: 2 }}>{item.notes}</p>}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#211A17' }}>${(lineTotal / 100).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.uuid, item.extraMeat, item.extraVegetable, item.notes, item.flavourSelections, item.optionSelections)}
                    aria-label={`Remove ${item.name} from cart`}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, padding: 0 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '14px 22px calc(env(safe-area-inset-bottom, 0px) + 20px)', borderTop: '1px solid #E7C3B5', flexShrink: 0, background: '#FFFCF7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#745F55', fontSize: '0.875rem', fontWeight: 500 }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.35rem', fontWeight: 700, color: '#211A17' }}>
                ${(totalCents() / 100).toFixed(2)}
              </span>
            </div>
            <button
              className="btn-brand"
              onClick={() => { onClose(); router.push('/checkout') }}
            >
              Go to Checkout
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer {
          position: fixed;
          right: 0; top: 0; bottom: 0;
          width: 400px; max-width: 100%;
          background: #FFFCF7;
          display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(33,26,23,0.14);
        }
        @media (max-width: 768px) {
          .cart-drawer {
            top: auto; left: 0;
            width: 100%; max-height: 88svh;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 -8px 40px rgba(33,26,23,0.14);
          }
        }
      `}</style>
    </div>
  )
}
