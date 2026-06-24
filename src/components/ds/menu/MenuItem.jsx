import React from 'react';

/**
 * Compact menu row: optional thumbnail, name + Chinese sub-label, dotted
 * leader, price. Used in list-style menu panels.
 */
export function MenuItem({ image, name, nameCn, price, note, invert = false, style = {}, ...props }) {
  const nameColor = invert ? 'var(--cream-050)' : 'var(--terracotta-600)';
  const cnColor = invert ? 'var(--saffron-300)' : 'var(--terracotta-400)';
  const noteColor = invert ? 'rgba(253,244,237,0.75)' : 'var(--ink-500)';
  const leader = invert ? 'rgba(253,244,237,0.4)' : 'var(--cream-300)';
  const priceColor = invert ? 'var(--saffron-500)' : 'var(--terracotta-500)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0', ...style }} {...props}>
      {image && (
        <img src={image} alt={name} style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flex: 'none', boxShadow: 'var(--shadow-xs)' }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-slab)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', color: nameColor, fontSize: 'var(--text-base)' }}>{name}</span>
          {nameCn && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', color: cnColor, fontSize: 'var(--text-sm)', letterSpacing: '0.08em' }}>{nameCn}</span>}
        </div>
        {note && <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: noteColor }}>{note}</div>}
      </div>
      <span aria-hidden="true" style={{ flex: 1, borderBottom: `2px dotted ${leader}`, minWidth: '12px', alignSelf: 'flex-end', marginBottom: '6px' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)', color: priceColor, fontSize: 'var(--text-lg)', flex: 'none' }}>{price}</span>
    </div>
  );
}
