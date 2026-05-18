'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/components/LangProvider';
import { copy } from '@/content/copy';

const EASE = [0.16, 1, 0.3, 1] as const;

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export default function Footer() {
  const { lang } = useLang();
  const t = copy[lang].footer;

  return (
    <footer style={{ background: 'var(--footer-bg)', position: 'relative', overflow: 'hidden', borderTop: '2px solid var(--project-accent)' }}>

      {/* Ambient glow — visible in dark mode only via --glow-opacity */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(0,207,186,0.07) 0%, transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          opacity: 'var(--glow-opacity)',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(80px, 12vw, 140px) clamp(24px, 5vw, 60px) clamp(48px, 7vw, 72px)',
          position: 'relative',
        }}
      >

        {/* ── Statement ──────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(32px, 5.5vw, 80px)',
            fontWeight: 900,
            color: 'var(--footer-text-main)',
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            marginBottom: 'clamp(48px, 8vw, 88px)',
            maxWidth: '900px',
          }}
        >
          {t.mantra}
          <br />
          <span style={{ color: 'var(--footer-highlight)' }}>{t.mantraHighlight}</span>
        </motion.p>

        {/* ── CTA + contact row ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '32px',
            marginBottom: 'clamp(48px, 7vw, 72px)',
          }}
        >
          {/* CTA + email */}
          <div>
            <p style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(16px, 2vw, 24px)',
              fontWeight: 600,
              color: 'var(--footer-text-main)',
              letterSpacing: '-0.018em',
              lineHeight: 1.2,
              marginBottom: '18px',
            }}>
              {t.cta}
            </p>
            <a
              href="mailto:josuebravodi@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Geist, sans-serif',
                fontSize: 'clamp(14px, 1.5vw, 18px)',
                fontWeight: 400,
                color: 'var(--footer-text-dim)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'color 0.22s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--footer-highlight)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--footer-text-dim)')}
            >
              {t.email}
              <span style={{ fontSize: '16px', fontWeight: 300 }} aria-hidden="true">↗</span>
            </a>
          </div>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/josuebravodi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'GeistMono, monospace',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: 'var(--footer-text-dim)',
              textDecoration: 'none',
              border: '1px solid var(--footer-btn-border)',
              borderRadius: '999px',
              padding: '10px 18px',
              transition: 'color 0.22s ease, border-color 0.22s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--footer-highlight)';
              e.currentTarget.style.borderColor = 'var(--footer-highlight)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--footer-text-dim)';
              e.currentTarget.style.borderColor = 'var(--footer-btn-border)';
            }}
          >
            <LinkedInIcon />
            LinkedIn
            <span aria-hidden="true">↗</span>
          </a>
        </motion.div>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'var(--footer-divider)',
          marginBottom: '28px',
        }} />

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{
            fontFamily: 'GeistMono, monospace',
            fontSize: '10px',
            color: 'var(--footer-text-faint)',
            letterSpacing: '0.04em',
          }}>
            {t.copyright}
          </span>
          <span style={{
            fontFamily: 'GeistMono, monospace',
            fontSize: '10px',
            color: 'var(--footer-text-faint)',
            letterSpacing: '0.04em',
          }}>
            {t.builtWith}
          </span>
        </div>

        {/* ── NDA disclaimer ──────────────────────────────────────── */}
        <p style={{
          fontFamily: 'GeistMono, monospace',
          fontSize: '10px',
          color: 'var(--footer-text-faint)',
          letterSpacing: '0.025em',
          lineHeight: 1.7,
          marginTop: '20px',
          maxWidth: '640px',
          opacity: 0.7,
        }}>
          {t.nda}
        </p>

      </div>
    </footer>
  );
}
