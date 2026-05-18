'use client';
import { useLang } from '@/components/LangProvider';
import { copy } from '@/content/copy';

export default function StatsRow() {
  const { lang } = useLang();
  const stats = copy[lang].stats;

  // Duplicate for seamless infinite loop
  const doubled = [...stats, ...stats];

  return (
    <div
      style={{
        borderTop: '1px solid var(--stats-divider)',
        borderBottom: '1px solid var(--stats-divider)',
        overflow: 'hidden',
        padding: 'clamp(18px, 2.4vw, 26px) 0',
        background: 'var(--bg-hero)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          animation: 'marquee-scroll 22s linear infinite',
          willChange: 'transform',
        }}
      >
        {doubled.map((s, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '5px',
              padding: '0 clamp(28px, 3.6vw, 52px)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(13px, 1.4vw, 18px)',
              fontWeight: 700,
              color: 'var(--text-hero)',
              letterSpacing: '-0.015em',
            }}>
              {s.value}
            </span>
            <span style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: 'clamp(9px, 0.85vw, 11px)',
              fontWeight: 400,
              color: 'var(--text-hero-dim)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}>
              {s.label}
            </span>
            {/* Separator after every item, including last — loop connects seamlessly */}
            <span style={{
              marginLeft: 'clamp(28px, 3.6vw, 52px)',
              color: 'var(--stats-divider)',
              fontSize: 'clamp(14px, 1.6vw, 20px)',
              opacity: 0.6,
              fontWeight: 300,
            }}>
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
