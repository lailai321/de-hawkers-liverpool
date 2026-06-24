import React from 'react';

/**
 * Small status / category label. Pill-shaped, uppercase.
 * tone: solid (terracotta), accent (saffron), soft, spicy (chili).
 */
export function Badge({ children, tone = 'solid', size = 'md', style = {}, ...props }) {
  const tones = {
    solid:  { background: 'var(--terracotta-500)', color: 'var(--cream-050)' },
    accent: { background: 'var(--saffron-500)', color: 'var(--ink-900)' },
    soft:   { background: 'var(--terracotta-050)', color: 'var(--terracotta-600)' },
    fresh:  { background: 'var(--scallion-500)', color: '#fff' },
    spicy:  { background: 'var(--terracotta-600)', color: 'var(--saffron-300)' },
  }[tone];
  const sizes = {
    sm: { font: '10px', pad: '3px 8px' },
    md: { font: '12px', pad: '5px 11px' },
  }[size];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        fontSize: sizes.font, padding: sizes.pad, lineHeight: 1,
        borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
        ...tones, ...style,
      }}
      {...props}
    >
      {tone === 'spicy' && <span aria-hidden="true">🌶</span>}
      {children}
    </span>
  );
}
