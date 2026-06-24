import React from 'react';

/**
 * Menu board section header: cart icon + chunky display title (English over
 * Chinese) + the running hawker. Matches the printed boards exactly.
 */
export function SectionHeader({ title, titleCn, align = 'left', style = {}, ...props }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '20px', ...style }} {...props}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ds/logo-cart.png" alt="" style={{ height: '64px', width: 'auto', flex: 'none' }} />
      <div style={{ textAlign: align }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-black)',
          textTransform: 'uppercase', color: 'var(--terracotta-500)',
          textShadow: 'var(--display-shadow)', fontSize: 'var(--text-4xl)', lineHeight: 0.95,
          letterSpacing: '0.005em',
        }}>{title}</div>
        {titleCn && (
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-bold)', color: 'var(--terracotta-500)', fontSize: 'var(--text-xl)', letterSpacing: '0.12em', marginTop: '4px' }}>{titleCn}</div>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ds/logo-hawker.png" alt="" style={{ height: '64px', width: 'auto', flex: 'none' }} />
    </div>
  );
}
