'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const NAV_LINKS = [
  { label: 'Menu',        href: '/' },
  { label: 'About',       href: '/about' },
  { label: 'Catering',    href: '/catering' },
  { label: 'Track Order', href: '/track' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [holidayToday, setHolidayToday] = useState(false)
  const pathname  = usePathname()
  const mobileRef = useRef<HTMLDivElement>(null)
  const count     = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const openCart  = useCartStore(s => s.openCart)

  useEffect(() => {
    const fetchHoliday = () => {
      fetch('/api/holidays', { cache: 'no-store' })
        .then(r => r.json())
        .then(d => {
          const closed = Boolean(d.today)
          setHolidayToday(closed)
          document.body.classList.toggle('holiday-day', closed)
        })
        .catch(() => {})
    }
    fetchHoliday()
    const onVisible = () => { if (document.visibilityState === 'visible') fetchHoliday() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <nav
        className={`main-nav${scrolled ? ' main-nav--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="nav-logo-link" aria-label="De Hawker's Liverpool – Home">
          <Image
            src="/brand/logo-cart-transparent.png"
            alt="De Hawker's Liverpool"
            width={102}
            height={60}
            className="nav-logo-img"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="desktop-nav" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                role="listitem"
                className={`nav-link${active ? ' nav-link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: Halal label + cart + hamburger */}
        <div className="nav-right">
          <span className="halal-label" aria-label="Halal certified">
            <CheckCircle size={13} strokeWidth={2.2} aria-hidden="true" />
            Halal Friendly
          </span>

          {/* Cart button — desktop */}
          <button
            onClick={openCart}
            className="nav-cart-btn"
            aria-label={count > 0 ? `View cart, ${count} item${count > 1 ? 's' : ''}` : 'View cart'}
          >
            <ShoppingBag size={18} strokeWidth={2} aria-hidden="true" />
            {count > 0
              ? <span className="nav-cart-label">Cart · {count}</span>
              : <span className="nav-cart-label">Cart</span>
            }
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="hamburger-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen
              ? <X size={22} strokeWidth={2} aria-hidden="true" />
              : <Menu size={22} strokeWidth={2} aria-hidden="true" />
            }
          </button>
        </div>
      </nav>

      {/* Holiday closed banner */}
      {holidayToday && (
        <div className="holiday-banner" role="alert">
          We&apos;re closed today — See you next time!
        </div>
      )}

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileRef}
          className="mobile-dropdown"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`mobile-nav-link${pathname === href ? ' mobile-nav-link--active' : ''}`}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}

          {/* Mobile cart button */}
          <div style={{ padding: '12px 20px 20px' }}>
            <button
              onClick={() => { setMobileOpen(false); openCart() }}
              className="mobile-cart-open-btn"
              aria-label={`Open cart${count > 0 ? `, ${count} item${count > 1 ? 's' : ''}` : ''}`}
            >
              <ShoppingBag size={18} strokeWidth={2} aria-hidden="true" />
              <span>{count > 0 ? `View Cart · ${count}` : 'View Cart'}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* ── Desktop base ── */
        .main-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 84px;
          background: #FFF8EF;
          border-bottom: 1px solid #E7C3B5;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          gap: 24px;
          transition: box-shadow 0.2s;
        }
        .main-nav--scrolled {
          box-shadow: 0 2px 12px rgba(182,58,36,0.10);
        }

        .nav-logo-link {
          display: flex; align-items: center; flex-shrink: 0;
          text-decoration: none;
        }

        .desktop-nav {
          display: flex; gap: 32px; align-items: center;
          flex: 1; justify-content: center;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #211A17;
          text-decoration: none;
          padding-bottom: 3px;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #B63A24; }
        .nav-link--active {
          color: #B63A24;
          border-bottom-color: #B63A24;
        }

        .nav-right {
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }

        .halal-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #B63A24;
          background: #FFF0EA;
          border: 1.5px solid #E7C3B5;
          padding: 6px 12px;
          border-radius: 20px;
          height: 34px;
          white-space: nowrap;
        }

        .nav-cart-btn {
          display: flex; align-items: center; gap: 7px;
          background: #B63A24;
          color: #FFFFFF;
          border: none;
          border-radius: 50px;
          padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          transition: background 0.15s, box-shadow 0.15s;
          min-height: 44px;
          white-space: nowrap;
        }
        .nav-cart-btn:hover { background: #8F2C1B; box-shadow: 0 4px 14px rgba(182,58,36,0.32); }
        .nav-cart-label { line-height: 1; }

        .hamburger-btn { display: none; }

        .mobile-dropdown {
          position: fixed;
          top: 84px; left: 0; right: 0;
          z-index: 99;
          background: #FFF8EF;
          border-bottom: 1px solid #E7C3B5;
          box-shadow: 0 8px 24px rgba(33,26,23,0.12);
          animation: fadeIn 0.15s ease;
        }
        .mobile-nav-link {
          display: block;
          padding: 14px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #211A17;
          text-decoration: none;
          border-bottom: 1px solid #F5EBE6;
          transition: background 0.12s, color 0.12s;
        }
        .mobile-nav-link:hover { background: #F5EBE6; }
        .mobile-nav-link--active { color: #B63A24; }

        .mobile-cart-open-btn {
          display: flex; align-items: center; gap: 8px; justify-content: center;
          width: 100%;
          background: #B63A24; color: #FFFFFF;
          border: none; border-radius: 50px;
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 700;
          cursor: pointer; min-height: 48px;
          transition: background 0.15s;
        }
        .mobile-cart-open-btn:hover { background: #8F2C1B; }

        .holiday-banner {
          position: fixed; top: 84px; left: 0; right: 0; z-index: 99;
          background: #211A17; border-bottom: 2px solid #F4C76B;
          color: #F4C76B; text-align: center;
          padding: 12px 20px;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 0.95rem; letter-spacing: 0.01em;
        }
        body.holiday-day .main-content { padding-top: 128px !important; }

        /* ── Mobile overrides ── */
        @media (max-width: 768px) {
          .main-nav { height: 64px; padding: 0 16px; }
          .desktop-nav { display: none; }
          .halal-label { display: none; }
          .nav-cart-btn { display: none !important; }
          .hamburger-btn {
            display: flex; align-items: center; justify-content: center;
            background: none; border: none;
            color: #211A17; padding: 8px;
            cursor: pointer; min-width: 44px; min-height: 44px;
            border-radius: 8px;
            transition: background 0.12s;
          }
          .hamburger-btn:hover { background: #F5EBE6; }
          .mobile-dropdown { top: 64px; }
          .holiday-banner { top: 64px; font-size: 0.85rem; }
          body.holiday-day .main-content { padding-top: 108px !important; }
        }
      `}</style>
    </>
  )
}
