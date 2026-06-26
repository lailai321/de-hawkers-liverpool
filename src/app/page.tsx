'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, Clock, Phone, ShoppingBag, Search, X, ChevronDown, CheckCircle } from 'lucide-react'
import Image from 'next/image'

import { MenuCategory, MenuItem } from '@/types'
import CategoryNav from '@/components/CategoryNav'
import ItemCard from '@/components/ItemCard'
import ItemModal from '@/components/ItemModal'
import PromoBanner from '@/components/PromoBanner'
import FeaturedDishes from '@/components/FeaturedDishes'
import Footer from '@/components/Footer'

interface MenuData {
  categories: MenuCategory[]
  soldOut: string[]
  overrides: Record<string, { name?: string; price_cents?: number; description?: string; is_hidden?: boolean }>
}

export default function HomePage() {
  const [isAdminView] = useState(() =>
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('admin') === 'true'
      : false
  )
  const [data, setData]                 = useState<MenuData | null>(null)
  const [loadError, setLoadError]       = useState(false)
  const [activeSlug, setActiveSlug]     = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery]   = useState('')
  const [holidayStatus, setHolidayStatus] = useState<{ today: boolean; tomorrow: boolean } | null>(null)
  const sectionRefs  = useRef<Record<string, HTMLElement | null>>({})
  const isScrolling  = useRef(false)
  const menuRef      = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const fetchMenu = useCallback(() => {
    setLoadError(false)
    fetch('/api/menu')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then((d: MenuData) => {
        setData(d)
        setActiveSlug(prev => prev || d.categories[0]?.slug || '')
      })
      .catch(() => setLoadError(true))
  }, [])

  const fetchHolidayStatus = useCallback(() => {
    fetch('/api/holidays', { cache: 'no-store' })
      .then(r => r.json())
      .then(setHolidayStatus)
      .catch(() => setHolidayStatus({ today: false, tomorrow: false }))
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMenu()
    fetchHolidayStatus()
    const onVisible = () => { if (document.visibilityState === 'visible') fetchHolidayStatus() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchMenu, fetchHolidayStatus])

  useEffect(() => {
    if (!data) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b)
          const slug = (top.target as HTMLElement).dataset.slug
          if (slug) setActiveSlug(slug)
        }
      },
      { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
    )
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [data])

  function scrollToCategory(slug: string) {
    const el = sectionRefs.current[slug]
    if (!el) return
    setActiveSlug(slug)
    isScrolling.current = true
    const offset = window.innerWidth <= 768 ? 120 : 100
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    setTimeout(() => { isScrolling.current = false }, 1200)
  }

  function scrollToMenu() {
    if (menuRef.current) {
      const top = menuRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      setTimeout(() => searchInputRef.current?.focus(), 600)
    }
  }

  // Loading state
  if (!data && !loadError) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8EF' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #E7C3B5', borderTopColor: '#B63A24', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  // Error state
  if (loadError) return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#FFF8EF', padding: '0 24px' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#745F55', fontSize: '1rem', textAlign: 'center' }}>
        Couldn&apos;t load the menu. Please check your connection.
      </p>
      <button
        onClick={fetchMenu}
        style={{
          background: '#B63A24', color: '#FFFFFF', border: 'none', borderRadius: '50px',
          padding: '12px 28px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
          fontSize: '0.95rem', cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  )

  const isSearching = searchQuery.trim().length > 0

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100svh' }}>

      {/* Admin back button */}
      {isAdminView && (
        <div style={{ background: '#211A17', padding: '10px 20px' }}>
          <a href="/admin" style={{ color: '#F4C76B', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            ← Back to Admin
          </a>
        </div>
      )}

      {/* Tomorrow closed banner */}
      {!holidayStatus?.today && holidayStatus?.tomorrow && (
        <div role="alert" style={{ background: '#211A17', color: '#F4C76B', textAlign: 'center', padding: '12px 20px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>
          We&apos;ll be closed tomorrow. Order today!
          <span style={{ opacity: 0.6, fontWeight: 400 }}> 明日休息，欢迎今天提前点餐！</span>
        </div>
      )}

      {/* ─── 1. Hero ─── */}
      <div className="hero-wrapper" role="banner">
        <Image
          src="/banner.png"
          alt="De Hawker's Liverpool — Asian hawker-style wok restaurant"
          fill
          style={{ objectFit: 'cover', objectPosition: '35% 50%' }}
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(33,26,23,0.04) 0%, rgba(33,26,23,0.20) 35%, rgba(33,26,23,0.72) 70%, rgba(33,26,23,0.90) 100%)', zIndex: 1 }} />
        {/* Brand logo watermark — decorative */}
        <div className="hero-logo-watermark" aria-hidden="true">
          <Image
            src="/brand/logo-emblem-white.png"
            alt=""
            width={340}
            height={340}
            style={{ objectFit: 'contain', display: 'block' }}
          />
        </div>
        {/* Holiday overlay */}
        {holidayStatus?.today && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)', zIndex: 2 }} />
        )}

        <div className="hero-content">
          <h1 className="hero-title">De Hawker&apos;s Liverpool</h1>

          <address className="hero-info" style={{ fontStyle: 'normal' }}>
            <a
              href="https://maps.google.com/?q=Shop+1011+Westfield+Liverpool+Elizabeth+St+Liverpool+NSW+2170"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-info-item"
            >
              <MapPin size={14} strokeWidth={2.2} className="hero-info-icon" aria-hidden="true" />
              Shop 1011, Westfield Liverpool, Elizabeth St, Liverpool NSW 2170
            </a>
            <span className="hero-info-item">
              <Clock size={14} strokeWidth={2.2} className="hero-info-icon" aria-hidden="true" />
              Mon–Wed, Fri–Sun 9am–6pm · Thu 9am–9pm
            </span>
            <a href="tel:+61420226788" className="hero-info-item">
              <Phone size={14} strokeWidth={2.2} className="hero-info-icon" aria-hidden="true" />
              0420 226 788
            </a>
          </address>

          <div className="hero-tags">
            <span className="hero-tag-pickup">
              <ShoppingBag size={13} strokeWidth={2.2} aria-hidden="true" />
              Pick-up Only
            </span>
            <span className="hero-tag-nodelivery">Delivery Unavailable</span>
            <span className="hero-tag-halal">
              <CheckCircle size={13} strokeWidth={2.2} aria-hidden="true" />
              Halal Friendly
            </span>
          </div>

          <div className="hero-actions">
            <button
              onClick={scrollToMenu}
              className="hero-btn-primary"
              aria-label="Order for pick-up — jump to menu"
            >
              <ShoppingBag size={17} strokeWidth={2} aria-hidden="true" />
              Order for Pick-up
            </button>
            <button
              onClick={() => { scrollToMenu(); setTimeout(() => searchInputRef.current?.focus(), 700) }}
              className="hero-btn-secondary"
              aria-label="Browse the full menu"
            >
              Browse Menu
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. Promo ─── */}
      <div className="hero-coupons" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Subtle brand watermark behind coupons */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          opacity: 0.06, pointerEvents: 'none', userSelect: 'none',
        }}>
          <Image src="/brand/logo-cart-transparent.png" alt="" width={90} height={90} style={{ objectFit: 'contain' }} />
        </div>
        <PromoBanner />
      </div>

      {/* ─── 3. Menu Explorer (Search + Category) ─── */}
      <div className="menu-explorer" ref={menuRef}>
        <div className="menu-explorer-inner">
          <h2>Explore the Menu</h2>
          <div className="search-wrap">
            <Search size={18} strokeWidth={2} className="search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="menu-search"
              type="search"
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes…"
              aria-label="Search menu items"
              autoComplete="off"
            />
            {isSearching && (
              <button
                className="search-clear"
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus() }}
                aria-label="Clear search"
              >
                <X size={16} strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile sticky category nav ─── */}
      <div className="mobile-cat-sticky">
        <CategoryNav
          categories={data!.categories}
          activeSlug={activeSlug}
          onSelect={(slug) => { setSearchQuery(''); scrollToCategory(slug) }}
        />
      </div>

      {/* ─── 4. Today's Picks ─── */}
      {!isSearching && (
        <FeaturedDishes categories={data!.categories} onSelect={setSelectedItem} />
      )}

      {/* ─── 5. Full menu ─── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div className="page-body">

          {/* Desktop sidebar */}
          <aside className="cat-sidebar" aria-label="Menu categories">
            {data!.categories.map(cat => {
              const visible = cat.items.filter(item => !data!.overrides[item.uuid]?.is_hidden)
              if (!visible.length) return null
              return (
                <button
                  key={cat.slug}
                  className={`cat-sidebar-btn${activeSlug === cat.slug ? ' active' : ''}`}
                  onClick={() => { setSearchQuery(''); scrollToCategory(cat.slug) }}
                  aria-current={activeSlug === cat.slug ? 'true' : undefined}
                >
                  {cat.name}
                </button>
              )
            })}
          </aside>

          {/* Main content */}
          <main className="menu-main" aria-label="Menu items">

            {/* Menu sections */}
            {data!.categories.map(cat => {
              const allItems = cat.items
                .filter(item => !data!.overrides[item.uuid]?.is_hidden)
                .map(item => {
                  const ov = data!.overrides[item.uuid]
                  return {
                    ...item,
                    name:        ov?.name ?? item.name,
                    price:       ov?.price_cents != null ? ov.price_cents / 100 : item.price,
                    description: ov?.description ?? item.description,
                  }
                })

              const visible = isSearching
                ? allItems.filter(item => {
                    const q = searchQuery.toLowerCase()
                    return item.name.toLowerCase().includes(q) ||
                      (item.description?.toLowerCase().includes(q) ?? false)
                  })
                : allItems

              if (!visible.length) return null

              return (
                <section
                  key={cat.slug}
                  data-slug={cat.slug}
                  ref={el => { sectionRefs.current[cat.slug] = el }}
                  style={{ scrollMarginTop: 108 }}
                  aria-labelledby={`cat-${cat.slug}`}
                >
                  <h2 id={`cat-${cat.slug}`} className="cat-section-title">{cat.name}</h2>
                  <div className="item-grid">
                    {visible.map(item => (
                      <ItemCard
                        key={item.uuid}
                        item={item}
                        isSoldOut={data!.soldOut.includes(item.uuid)}
                        onClick={() => setSelectedItem(item)}
                        triggerRef={undefined}
                      />
                    ))}
                  </div>
                </section>
              )
            })}

            {/* No results */}
            {isSearching && data!.categories.every(cat => {
              const q = searchQuery.toLowerCase()
              return !cat.items.filter(item => !data!.overrides[item.uuid]?.is_hidden).some(item => {
                const ov = data!.overrides[item.uuid]
                const name = ov?.name ?? item.name
                const desc = ov?.description ?? item.description
                return name.toLowerCase().includes(q) || (desc?.toLowerCase().includes(q) ?? false)
              })
            }) && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Search size={32} strokeWidth={1.5} style={{ color: '#E7C3B5', marginBottom: 12 }} aria-hidden="true" />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#745F55', marginBottom: 12 }}>
                  No items found for &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#B63A24', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Clear search
                </button>
              </div>
            )}

          </main>
        </div>
      </div>

      <Footer />

      <ItemModal
        key={selectedItem?.uuid ?? 'none'}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
