import React from 'react';

/**
 * Selectable ingredient / option chip — "Add your star ingredient".
 * Capsule with optional price; fills terracotta when selected.
 */
export function IngredientChip({ label, price, selected = false, onClick, style = {}, ...props }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        height: 'var(--control-h-md)', padding: '0 8px 0 18px',
        borderRadius: 'var(--radius-pill)', cursor: 'pointer',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 'var(--text-sm)',
        background: selected ? 'var(--terracotta-500)' : 'var(--paper-white)',
        color: selected ? 'var(--cream-050)' : 'var(--terracotta-600)',
        border: `2px solid ${selected ? 'var(--terracotta-500)' : 'var(--cream-300)'}`,
        transition: 'all var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...props}
    >
      <span>{label}</span>
      {price && (
        <span style={{
          fontWeight: 'var(--fw-black)', fontSize: 'var(--text-sm)',
          background: selected ? 'var(--saffron-500)' : 'var(--terracotta-050)',
          color: selected ? 'var(--ink-900)' : 'var(--terracotta-600)',
          padding: '4px 11px', borderRadius: 'var(--radius-pill)',
        }}>{price}</span>
      )}
    </button>
  );
}
