import React from 'react';

/**
 * De Hawker's primary button. Chunky, rounded, street-food energy.
 * Primary = terracotta fill; accent = saffron; ghost = outlined.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...props
}) {
  const sizes = {
    sm: { height: 'var(--control-h-sm)', padding: '0 14px', font: 'var(--text-sm)' },
    md: { height: 'var(--control-h-md)', padding: '0 22px', font: 'var(--text-base)' },
    lg: { height: 'var(--control-h-lg)', padding: '0 30px', font: 'var(--text-lg)' },
  }[size];

  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--color-on-primary)',
      border: '2px solid var(--color-primary)',
      boxShadow: 'var(--shadow-sm)',
    },
    accent: {
      background: 'var(--color-accent)',
      color: 'var(--color-on-accent)',
      border: '2px solid var(--color-accent)',
      boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
      boxShadow: 'none',
    },
    quiet: {
      background: 'var(--terracotta-050)',
      color: 'var(--color-primary)',
      border: '2px solid transparent',
      boxShadow: 'none',
    },
  }[variant];

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: block ? '100%' : 'auto',
        height: sizes.height,
        padding: sizes.padding,
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-bold)',
        fontSize: sizes.font,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        lineHeight: 1,
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform var(--dur-fast) var(--ease-bounce), filter var(--dur-base), box-shadow var(--dur-base)',
        ...variants,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.94)'; }}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
