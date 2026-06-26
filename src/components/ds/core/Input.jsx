import React from 'react';

/** Text input with De Hawker's warm styling. */
export function Input({ label, hint, error, style = {}, id, ...props }) {
  // eslint-disable-next-line react-hooks/purity
  const inputId = id || `dh-in-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-body)' }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)',
          fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em',
          color: 'var(--ink-700)',
        }}>{label}</label>
      )}
      <input
        id={inputId}
        style={{
          height: 'var(--control-h-md)', padding: '0 16px',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-900)',
          background: 'var(--paper-white)',
          border: `2px solid ${error ? 'var(--terracotta-500)' : 'var(--cream-300)'}`,
          borderRadius: 'var(--radius-md)', outline: 'none',
          transition: 'border-color var(--dur-base), box-shadow var(--dur-base)',
          ...style,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--saffron-500)'; e.currentTarget.style.boxShadow = 'var(--focus-ring)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--terracotta-500)' : 'var(--cream-300)'; e.currentTarget.style.boxShadow = 'none'; }}
        {...props}
      />
      {(hint || error) && (
        <span style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--terracotta-500)' : 'var(--ink-500)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
