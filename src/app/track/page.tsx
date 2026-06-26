'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search, Package, CheckCircle, Clock } from 'lucide-react'

interface OrderSummary {
  id: string
  order_number: number
  total_cents: number
  pickup_time: string
  status: 'confirmed' | 'ready' | 'collected'
  created_at: string
  order_items: { item_name: string; quantity: number }[]
}

const F = { fontFamily: "'DM Sans', sans-serif" } as const
const R = { fontFamily: "'Playfair Display', Georgia, serif" } as const

const STATUS_CONFIG = {
  confirmed:  { label: "Preparing your order…",     bg: '#FFF7D6', color: '#9A6700', icon: <Clock size={14} strokeWidth={2} aria-hidden="true" /> },
  ready:      { label: 'Ready for Pickup!',          bg: '#DCFCE7', color: '#166534', icon: <CheckCircle size={14} strokeWidth={2} aria-hidden="true" /> },
  completed:  { label: 'Order Completed',            bg: '#F5F5F5', color: '#555',    icon: <Package size={14} strokeWidth={2} aria-hidden="true" /> },
}

function resolveStatus(order: OrderSummary, now: number) {
  const ageHours = (now - new Date(order.created_at).getTime()) / 3_600_000
  if (ageHours > 6)                   return STATUS_CONFIG.completed
  if (order.status === 'collected')   return STATUS_CONFIG.completed
  if (order.status === 'ready')       return STATUS_CONFIG.ready
  return STATUS_CONFIG.confirmed
}

export default function TrackPage() {
  const [phone, setPhone]               = useState('')
  const [searchedPhone, setSearchedPhone] = useState('')
  const [orders, setOrders]             = useState<OrderSummary[] | null>(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [renderNow]                     = useState(() => Date.now())

  const fetchOrders = useCallback(async (value: string, quiet = false) => {
    if (!quiet) setLoading(true)
    try {
      const res = await fetch(`/api/track?phone=${encodeURIComponent(value)}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not load orders')
      setOrders(data.orders); setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load orders')
    } finally {
      if (!quiet) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!searchedPhone) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void fetchOrders(searchedPhone, true)
    }, 15000)
    const onVisible = () => { if (document.visibilityState === 'visible') void fetchOrders(searchedPhone, true) }
    document.addEventListener('visibilitychange', onVisible)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [fetchOrders, searchedPhone])

  function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    const value = phone.trim()
    setSearchedPhone(value)
    void fetchOrders(value)
  }

  return (
    <div style={{ background: '#FFF8EF', minHeight: '100svh', padding: '56px 16px 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ ...R, fontSize: 'clamp(2rem, 8vw, 2.8rem)', color: '#211A17', letterSpacing: '0.01em', textAlign: 'center', marginBottom: 8 }}>
          Track Your Order
        </h1>
        <p style={{ ...F, fontSize: '0.95rem', color: '#745F55', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
          Enter the mobile number used when ordering.
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <label htmlFor="track-phone" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
            Mobile number
          </label>
          <input
            id="track-phone"
            className="input-dark"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="04xx xxx xxx"
            required
            autoComplete="tel"
            style={{ flex: 1, minWidth: 0, fontSize: 16 }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-brand"
            style={{ width: 'auto', minWidth: 100, padding: '0 20px', fontSize: '0.95rem', borderRadius: 10 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Searching
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Search size={15} strokeWidth={2} aria-hidden="true" />
                Search
              </span>
            )}
          </button>
        </form>

        {searchedPhone && orders && (
          <p style={{ ...F, fontSize: '0.75rem', color: '#B5A399', textAlign: 'center', marginBottom: 24 }}>
            Status updates automatically every 15 seconds.
          </p>
        )}

        {error && (
          <p role="alert" style={{ ...F, color: '#DC2626', textAlign: 'center', margin: '20px 0', fontSize: '0.9rem' }}>{error}</p>
        )}

        {orders !== null && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#B5A399' }}>
            <Package size={36} strokeWidth={1.2} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p style={{ ...F, color: '#745F55', fontSize: '0.9rem' }}>No recent orders found for this number.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => {
              const status = resolveStatus(order, renderNow)
              const ageHours = (renderNow - new Date(order.created_at).getTime()) / 3_600_000
              return (
                <article key={order.id} style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: '18px 20px',
                  border: order.status === 'ready' && ageHours <= 6 ? '2px solid #22C55E' : '1.5px solid #E7C3B5',
                  boxShadow: '0 2px 10px rgba(182,58,36,0.07)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div>
                      <h2 style={{ ...R, fontSize: '1.2rem', color: '#211A17', letterSpacing: '0.01em' }}>
                        Order #{String(order.order_number).padStart(4, '0')}
                      </h2>
                      <p style={{ ...F, fontSize: '0.78rem', color: '#B5A399', marginTop: 3 }}>
                        {new Date(order.created_at).toLocaleString('en-AU', {
                          timeZone: 'Australia/Sydney',
                          day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      ...F, fontSize: '0.78rem', fontWeight: 700,
                      color: status.color, background: status.bg,
                      padding: '6px 10px', borderRadius: 6,
                    }}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <p style={{ ...F, fontSize: '0.875rem', color: '#211A17', lineHeight: 1.55, marginBottom: 10 }}>
                    {order.order_items.map(item => `${item.quantity} × ${item.item_name}`).join(', ')}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderTop: '1px solid #F5EBE6', paddingTop: 10 }}>
                    <span style={{ ...F, fontSize: '0.85rem', color: '#745F55' }}>
                      Pickup: {order.pickup_time === 'asap' ? 'ASAP' : order.pickup_time}
                    </span>
                    <strong style={{ ...F, fontSize: '0.95rem', color: '#B63A24', fontWeight: 700 }}>
                      ${(order.total_cents / 100).toFixed(2)}
                    </strong>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
