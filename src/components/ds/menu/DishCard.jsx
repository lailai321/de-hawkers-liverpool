import React from 'react';

/**
 * Dish card: a top-down food photo sitting on the signature saffron halo,
 * with the English name, Chinese sub-label and price. The hero unit of any
 * De Hawker's menu surface.
 */
export function DishCard({ image, name, nameCn, price, badge = null, onClick, style = {}, ...props }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--paper-white)', borderRadius: 'var(--radius-lg)',
        padding: '20px 18px 18px', textAlign: 'center', position: 'relative',
        boxShadow: 'var(--shadow-md)', cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base)',
        ...style,
      }}
      onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      {...props}
    >
      {badge && <div style={{ position: 'absolute', top: '14px', right: '14px' }}>{badge}</div>}
      <div style={{
        width: '150px', height: '150px', margin: '0 auto 18px', borderRadius: '50%',
        overflow: 'hidden', boxShadow: 'var(--dish-halo)', background: 'var(--cream-100)',
      }}>
        {image
          ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--ink-300)', fontFamily: 'var(--font-body)', fontSize: '12px' }}>photo</div>}
      </div>
      <div style={{ fontFamily: 'var(--font-slab)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', color: 'var(--terracotta-600)', fontSize: 'var(--text-xl)', lineHeight: 1.05 }}>{name}</div>
      {nameCn && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', color: 'var(--terracotta-500)', fontSize: 'var(--text-base)', letterSpacing: '0.1em', marginTop: '4px' }}>{nameCn}</div>}
      {price && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)', color: 'var(--ink-900)', fontSize: 'var(--text-2xl)', marginTop: '10px' }}>{price}</div>}
    </div>
  );
}
