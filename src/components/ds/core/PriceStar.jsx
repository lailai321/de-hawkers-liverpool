import React from 'react';

/**
 * The signature saffron starburst price badge from the menu boards.
 * Renders an 11-point star with the price in heavy dark type.
 */
export function PriceStar({ price = '$0.00', size = 120, style = {}, ...props }) {
  const points = 22;
  const cx = 50, cy = 50;
  const rOuter = 50, rInner = 41;
  let d = '';
  for (let i = 0; i < points; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI * 2 * i) / points - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }
  d += 'Z';
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }} {...props}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', filter: 'drop-shadow(var(--shadow-sm))' }}>
        <path d={d} fill="var(--saffron-500)" stroke="var(--saffron-600)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)',
        color: 'var(--ink-900)', fontSize: size * 0.2, letterSpacing: '-0.02em',
        transform: 'rotate(-7deg)',
      }}>
        {price}
      </span>
    </div>
  );
}
