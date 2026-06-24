import React from 'react';

/** Quantity stepper for ordering — round terracotta +/- buttons. */
export function QuantityStepper({ value = 1, min = 0, max = 99, onChange = () => {}, style = {} }) {
  const btn = (label, fn, disabled) => (
    <button
      aria-label={label === '+' ? 'increase' : 'decrease'}
      disabled={disabled}
      onClick={fn}
      style={{
        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
        background: disabled ? 'var(--cream-300)' : 'var(--terracotta-500)', color: '#fff',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)', fontSize: '20px',
        lineHeight: 1, cursor: disabled ? 'not-allowed' : 'pointer', display: 'grid', placeItems: 'center',
        transition: 'transform var(--dur-fast) var(--ease-bounce)',
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.9)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >{label}</button>
  );
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', ...style }}>
      {btn('–', () => onChange(Math.max(min, value - 1)), value <= min)}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)', fontSize: 'var(--text-xl)', color: 'var(--ink-900)', minWidth: '24px', textAlign: 'center' }}>{value}</span>
      {btn('+', () => onChange(Math.min(max, value + 1)), value >= max)}
    </div>
  );
}
