import React from 'react';

/**
 * De Hawker's wordmark lockup: De // Hawker's where // is a saffron
 * chopsticks detail. Optionally flanked by the cart / hawker icon marks.
 * Icon marks are served from /ds/ in the Next.js public folder.
 */
export function Logo({
  size = 40,
  marks = 'none',          // 'none' | 'cart' | 'both'
  color = 'var(--terracotta-500)',
  style = {},
  ...props
}) {
  const wordmark = (
    <span style={{
      fontFamily: 'var(--font-slab)', fontWeight: 'var(--fw-bold)',
      textTransform: 'uppercase', fontSize: size, lineHeight: 1, color,
      letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: '0.12em',
      whiteSpace: 'nowrap',
    }}>
      De
      <span style={{ color: 'var(--saffron-500)', transform: 'skewX(-12deg)', letterSpacing: '-0.06em', fontWeight: 700 }}>//</span>
      Hawker&apos;s
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, ...style }} {...props}>
      {(marks === 'cart' || marks === 'both') && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/ds/logo-cart.png" alt="" style={{ height: size * 1.45, width: 'auto' }} />
      )}
      {wordmark}
      {marks === 'both' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/ds/logo-hawker.png" alt="" style={{ height: size * 1.45, width: 'auto' }} />
      )}
    </span>
  );
}
