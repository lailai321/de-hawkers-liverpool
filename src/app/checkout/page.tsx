'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import RefundPolicy from '@/components/RefundPolicy'

function getSydneyNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }))
}

function getTimeSlots(): string[] {
  const now = getSydneyNow()
  const slots: string[] = []
  const earliest = new Date(now.getTime() + 30 * 60 * 1000)
  const open = new Date(now); open.setHours(9, 0, 0, 0)
  const closeHour = now.getDay() === 4 ? 21 : 18
  const close = new Date(now); close.setHours(closeHour, 0, 0, 0)
  const t = new Date(Math.max(earliest.getTime(), open.getTime()))
  const mins = t.getMinutes(), rem = mins % 15
  if (rem !== 0) t.setMinutes(mins + (15 - rem), 0, 0)
  while (t <= close) {
    const h = t.getHours(), m = t.getMinutes()
    const ampm = h >= 12 ? 'pm' : 'am'
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
    slots.push(`${h12}:${String(m).padStart(2, '0')}${ampm}`)
    t.setMinutes(t.getMinutes() + 15)
  }
  return slots
}

function isStoreOpen(): boolean {
  const now = getSydneyNow()
  const mins = now.getHours() * 60 + now.getMinutes()
  const closeMins = now.getDay() === 4 ? 21 * 60 : 18 * 60
  return mins >= 9 * 60 && mins < closeMins
}

const F = { fontFamily: "'DM Sans', sans-serif" } as const
const R = { fontFamily: "'Playfair Display', Georgia, serif" } as const

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCartStore()
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [pickupType, setPickupType] = useState<'asap' | 'schedule'>(() => isStoreOpen() ? 'asap' : 'schedule')
  const [pickupTime, setPickupTime] = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const [holidayToday, setHolidayToday] = useState(false)

  useEffect(() => {
    fetch('/api/holidays', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setHolidayToday(Boolean(data.today)))
      .catch(() => {})
  }, [])

  const slots = getTimeSlots(), storeOpen = isStoreOpen(), total = totalCents()

  if (items.length === 0) return (
    <div style={{ minHeight: '100svh', background: '#FFF8EF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px' }}>
      <p style={{ ...F, color: '#745F55', fontSize: '1rem' }}>Your cart is empty.</p>
      <Link href="/" style={{ ...F, fontWeight: 700, fontSize: '0.95rem', color: '#B63A24', textDecoration: 'none' }}>← Back to Menu</Link>
    </div>
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (holidayToday) return setError("We're closed today. See you soon!")
    if (!name.trim() || !phone.trim()) return setError('Please fill in your name and phone.')
    if (pickupType === 'schedule' && !pickupTime) return setError('Please select a pickup time.')
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), pickupTime: pickupType === 'asap' ? 'asap' : pickupTime, items, idempotencyKey }),
      })
      const data = await res.json()
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const focusFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#B63A24'
    e.target.style.boxShadow = '0 0 0 3px rgba(182,58,36,0.12)'
  }
  const blurFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#E7C3B5'
    e.target.style.boxShadow = 'none'
  }

  const pickupBtnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    flex: 1, padding: '12px 8px', borderRadius: 8,
    border: `2px solid ${active ? '#B63A24' : '#E7C3B5'}`,
    background: active ? '#B63A24' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#211A17',
    ...F, fontSize: '0.9rem', fontWeight: active ? 700 : 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s',
  })

  const labelS: React.CSSProperties = { ...F, fontSize: '0.875rem', fontWeight: 600, color: '#745F55', display: 'block', marginBottom: 6 }

  return (
    <div style={{ background: '#FFF8EF', minHeight: '100svh', padding: '36px 16px 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/" style={{ ...F, fontSize: '0.85rem', color: '#B63A24', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
          ← Back to Menu
        </Link>
        <h1 style={{ ...R, fontSize: '2.2rem', color: '#211A17', letterSpacing: '0.01em', marginBottom: 28 }}>Checkout</h1>

        {/* Order summary */}
        <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '16px 20px', marginBottom: 24, border: '1.5px solid #E7C3B5' }}>
          <p style={{ ...F, fontSize: '0.75rem', fontWeight: 700, color: '#B5A399', letterSpacing: '0.07em', marginBottom: 12 }}>ORDER SUMMARY</p>
          {items.map((item, i) => {
            const extras = (item.extraMeat ? 300 : 0) + (item.extraVegetable ? 300 : 0) + (item.optionExtrasCents ?? 0)
            const line = (Math.round(item.price * 100) + extras) * item.quantity
            const optionsSummary = item.optionSelections
              ? Object.values(item.optionSelections).flat().filter(Boolean).join(', ')
              : ''
            const subline = [optionsSummary, item.extraMeat ? '+Meat' : '', item.extraVegetable ? '+Veg' : ''].filter(Boolean).join(', ')
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ ...F, fontSize: '0.875rem', color: '#211A17' }}>×{item.quantity} {item.name}</span>
                  {subline && <p style={{ ...F, fontSize: '0.78rem', color: '#B5A399', marginTop: 1 }}>{subline}</p>}
                </div>
                <span style={{ ...F, fontSize: '0.875rem', fontWeight: 700, color: '#211A17', flexShrink: 0 }}>${(line / 100).toFixed(2)}</span>
              </div>
            )
          })}
          <div style={{ borderTop: '1px solid #F5EBE6', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...F, fontSize: '0.875rem', fontWeight: 700, color: '#211A17' }}>Total</span>
            <span style={{ ...R, fontSize: '1.25rem', fontWeight: 700, color: '#B63A24' }}>${(total / 100).toFixed(2)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label htmlFor="checkout-name" style={labelS}>Name</label>
            <input
              id="checkout-name"
              className="input-dark"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
              onFocus={focusFn}
              onBlur={blurFn}
            />
            <p style={{ ...F, fontSize: '0.72rem', color: '#B5A399', marginTop: 4 }}>Include last name so we can call your order</p>
          </div>

          <div>
            <label htmlFor="checkout-phone" style={labelS}>Phone</label>
            <input
              id="checkout-phone"
              className="input-dark"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="04xx xxx xxx"
              required
              autoComplete="tel"
              onFocus={focusFn}
              onBlur={blurFn}
            />
            <p style={{ ...F, fontSize: '0.72rem', color: '#B5A399', marginTop: 4 }}>We&apos;ll SMS you when your order is ready</p>
          </div>

          <div>
            <label style={labelS}>Pickup Time</label>
            {!storeOpen && slots.length === 0 ? (
              <div style={{ background: '#FFF8EF', border: '1.5px solid #E7C3B5', borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ ...F, fontSize: '0.85rem', color: '#211A17', fontWeight: 700, marginBottom: 4 }}>We&apos;re currently closed</p>
                <p style={{ ...F, fontSize: '0.78rem', color: '#745F55' }}>Open Mon–Sun 9am–6pm (Thu 9am–9pm, Sydney time)</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8 }} role="group" aria-label="Select pickup time type">
                  <button
                    type="button"
                    onClick={() => setPickupType('asap')}
                    disabled={!storeOpen}
                    style={pickupBtnStyle(pickupType === 'asap', !storeOpen)}
                    aria-pressed={pickupType === 'asap'}
                  >
                    ASAP (~15 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupType('schedule')}
                    disabled={slots.length === 0}
                    style={pickupBtnStyle(pickupType === 'schedule', slots.length === 0)}
                    aria-pressed={pickupType === 'schedule'}
                  >
                    Schedule
                  </button>
                </div>
                {pickupType === 'schedule' && slots.length > 0 && (
                  <select
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="input-dark"
                    style={{ marginTop: 8 }}
                    aria-label="Select pickup time"
                    onFocus={focusFn}
                    onBlur={blurFn}
                  >
                    <option value="">Select a time…</option>
                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </>
            )}
          </div>

          {error && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 8, padding: '12px 16px' }}>
              <AlertCircle size={16} color="#DC2626" strokeWidth={2} aria-hidden="true" />
              <p style={{ ...F, fontSize: '0.9rem', color: '#DC2626', fontWeight: 600 }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-brand"
            style={{ fontSize: '1rem', fontWeight: 700 }}
          >
            {loading
              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Processing…
                </span>
              : `Pay $${(total / 100).toFixed(2)}`
            }
          </button>

          <p style={{ ...F, textAlign: 'center', fontSize: '0.75rem', color: '#B5A399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
            SSL encrypted · Powered by Stripe
          </p>
        </form>

        <RefundPolicy />
      </div>
    </div>
  )
}
