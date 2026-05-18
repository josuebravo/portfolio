'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/components/LangProvider';
import { copy } from '@/content/copy';

const EASE = [0.16, 1, 0.3, 1] as const;

function blurUp(delay = 0) {
  return {
    initial:   { opacity: 0, y: 28, filter: 'blur(14px)' },
    whileInView: { opacity: 1, y: 0,  filter: 'blur(0px)' },
    viewport:  { once: true, margin: '-80px' },
    transition: { duration: 0.75, ease: EASE, delay },
  };
}

export default function PositioningStatement() {
  const { lang } = useLang();
  const t = copy[lang];
  const stats = t.stats;

  // Split headline to highlight the key word
  const headline = lang === 'en'
    ? 'I turn complex problems into clear, human products.'
    : 'Convierto problemas complejos en productos humanos y claros.';
  const highlight = lang === 'en' ? 'human' : 'humanos';
  const [before, after] = headline.split(highlight);

  const sub = lang === 'en'
    ? 'I design enterprise digital products where UX, AI, business strategy, and measurable impact have to meet.'
    : 'Diseño productos digitales enterprise donde el UX, la IA, la estrategia de negocio y el impacto medible se tienen que encontrar.';

  const doubled = [...stats, ...stats];

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderTop: '1px solid var(--stats-divider)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — dark mode only */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(500px, 80vw, 1000px)',
          height: 'clamp(400px, 55vh, 700px)',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(32,3,146,0.18) 0%, rgba(0,207,186,0.06) 45%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          opacity: 'var(--glow-opacity)',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* ── Text block ──────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(80px, 12vw, 140px) clamp(24px, 7vw, 100px) clamp(48px, 6vw, 80px)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '880px', textAlign: 'center' }}>

          {/* Main headline with highlighted word */}
          <motion.p
            {...blurUp(0)}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(36px, 6.2vw, 100px)',
              fontWeight: 900,
              color: 'var(--text-hero)',
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              marginBottom: 'clamp(24px, 3.5vw, 48px)',
            }}
          >
            {before}
            <span style={{ color: 'var(--project-accent)' }}>{highlight}</span>
            {after}
          </motion.p>

          {/* Sub copy */}
          <motion.p
            {...blurUp(0.14)}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(15px, 1.6vw, 21px)',
              fontWeight: 400,
              color: 'var(--text-hero-muted)',
              letterSpacing: '-0.010em',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {sub}
          </motion.p>

        </div>
      </div>

      {/* ── Stats marquee — anchored to the bottom of this section ── */}
      <motion.div
        {...blurUp(0.26)}
        style={{
          borderTop: '1px solid var(--stats-divider)',
          borderBottom: '1px solid var(--stats-divider)',
          overflow: 'hidden',
          padding: 'clamp(18px, 2.4vw, 26px) 0',
        }}
      >
        <div
          className="marquee-inner"
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
      </motion.div>

    </div>
  );
}
