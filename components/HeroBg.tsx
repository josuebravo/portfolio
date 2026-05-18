'use client';

// Hero background.
// Dark mode: radial indigo glow + bottom teal accent + subtle dot grid + grain.
// Light mode: dot grid + grain only — no glow, let the typography breathe.

export default function HeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* Grain overlay — animated film texture */}
      <div className="grain-overlay" />

      {/* Dot grid — architectural precision, theme-aware opacity */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 'var(--grid-opacity)',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--text-hero)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Single indigo glow — visible only in dark mode via CSS var opacity */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(600px, 80vw, 1200px)',
          height: 'clamp(500px, 62vh, 900px)',
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(32,3,146,0.32) 0%, rgba(0,207,186,0.07) 45%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          opacity: 'var(--glow-opacity)',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Subtle bottom teal accent — dark mode only */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          right: '8%',
          width: '560px',
          height: '440px',
          background:
            'radial-gradient(ellipse at center, rgba(0,207,186,0.08) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          opacity: 'var(--glow-opacity)',
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
}
