'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'

const F = { fontFamily: "'DM Sans', sans-serif" } as const
const R = { fontFamily: "'Playfair Display', Georgia, serif" } as const

export default function CateringPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/catering', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) setSent(true)
      else setError('Something went wrong. Please call us at 0420 226 788.')
    } catch { setError('Network error. Please call us at 0420 226 788.') }
    finally { setLoading(false) }
  }

  const focusFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#B63A24'
    e.target.style.boxShadow = '0 0 0 3px rgba(182,58,36,0.12)'
  }
  const blurFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#E7C3B5'
    e.target.style.boxShadow = 'none'
  }

  const inputS: React.CSSProperties = {
    ...F, background: '#FFFFFF', border: '1.5px solid #E7C3B5', borderRadius: 8,
    padding: '12px 16px', color: '#211A17', fontSize: '1rem', width: '100%',
    outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  const labelS: React.CSSProperties = {
    ...F, fontSize: '0.875rem', fontWeight: 600, color: '#745F55',
    display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ background: '#FFF8EF', minHeight: '100svh', padding: '48px 16px 80px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ ...R, fontSize: 'clamp(2rem, 6vw, 2.6rem)', color: '#211A17', letterSpacing: '0.01em', marginBottom: 8 }}>
          Catering Services
        </h1>
        <p style={{ ...F, fontSize: '0.95rem', color: '#745F55', marginBottom: 28, lineHeight: 1.6 }}>
          Hosting a party or event? We offer custom catering for any occasion.
        </p>

        {/* Info chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', borderRadius: 8, padding: '10px 16px', border: '1.5px solid #E7C3B5' }}>
            <CheckCircle size={17} color="#22C55E" strokeWidth={2} aria-hidden="true" />
            <span style={{ ...F, fontSize: '0.9rem', color: '#211A17' }}>Discounted pricing available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFF8EF', borderRadius: 8, padding: '10px 16px', border: '1.5px solid #E7C3B5' }}>
            <AlertCircle size={17} color="#F4C76B" strokeWidth={2} aria-hidden="true" />
            <span style={{ ...F, fontSize: '0.9rem', color: '#211A17' }}>Please enquire 3–5 business days in advance</span>
          </div>
        </div>

        {sent ? (
          <div style={{ background: '#FFFFFF', borderRadius: 14, padding: '48px 32px', textAlign: 'center', border: '1.5px solid #E7C3B5', boxShadow: '0 4px 20px rgba(182,58,36,0.08)' }}>
            <CheckCircle size={40} color="#22C55E" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
            <p style={{ ...R, fontSize: '1.6rem', color: '#211A17', letterSpacing: '0.01em', marginBottom: 8 }}>Enquiry Received!</p>
            <p style={{ ...F, fontSize: '0.9rem', color: '#745F55', marginBottom: 24 }}>We&apos;ll be in touch within 1 business day.</p>
            <Link href="/" style={{ ...F, fontWeight: 700, fontSize: '0.95rem', color: '#B63A24', textDecoration: 'none' }}>← Back to Menu</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', borderRadius: 14, padding: '28px 24px', border: '1.5px solid #E7C3B5', boxShadow: '0 4px 20px rgba(182,58,36,0.07)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Your Name',         key: 'name',  type: 'text',  placeholder: 'Full name',       required: true },
              { label: 'Phone',             key: 'phone', type: 'tel',   placeholder: '04xx xxx xxx',    required: true },
              { label: 'Email (optional)',  key: 'email', type: 'email', placeholder: 'your@email.com',  required: false },
              { label: 'Event Date',        key: 'date',  type: 'date',  placeholder: '',                required: true },
              { label: 'Event Time',        key: 'time',  type: 'time',  placeholder: '',                required: true },
            ].map(({ label, key, type, placeholder, required }) => (
              <div key={key}>
                <label htmlFor={`catering-${key}`} style={labelS}>{label}</label>
                <input
                  id={`catering-${key}`}
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  required={required}
                  style={inputS}
                  onFocus={focusFn}
                  onBlur={blurFn}
                />
              </div>
            ))}

            <div>
              <label htmlFor="catering-guests" style={labelS}>Number of Guests</label>
              <select
                id="catering-guests"
                value={form.guests}
                onChange={set('guests')}
                required
                style={{ ...inputS, background: '#FFF', cursor: 'pointer' }}
                onFocus={focusFn}
                onBlur={blurFn}
              >
                <option value="">Select…</option>
                {['10–15', '15–20', '20–30', '30–50', '50+'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="catering-notes" style={labelS}>Additional Notes</label>
              <textarea
                id="catering-notes"
                value={form.message}
                onChange={set('message')}
                rows={3}
                placeholder="Type of event, dietary requirements, specific dishes…"
                style={{ ...inputS, resize: 'none' }}
                onFocus={focusFn}
                onBlur={blurFn}
              />
            </div>

            {error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}>
                <AlertCircle size={16} color="#DC2626" strokeWidth={2} aria-hidden="true" />
                <p style={{ ...F, fontSize: '0.875rem', color: '#DC2626' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-brand">
              {loading ? 'Sending…' : 'Submit Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
