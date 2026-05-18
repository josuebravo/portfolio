'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100svh',
      background: 'var(--bg-hero)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(40px, 8vw, 80px)',
      gap: '0',
    }}>
      {/* Big 404 */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ lineHeight: 0.84 }}
      >
        <span style={{
          fontFamily:    'Sora, sans-serif',
          fontSize:      'clamp(100px, 22vw, 300px)',
          fontWeight:    900,
          letterSpacing: '-0.04em',
          color:         'var(--text-hero)',
          display:       'block',
        }}>
          4<span style={{ color: 'var(--project-accent)' }}>0</span>4
        </span>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
        style={{
          fontFamily:    'GeistMono, monospace',
          fontSize:      'clamp(10px, 0.85vw, 11px)',
          fontWeight:    400,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         'var(--text-hero-dim)',
          marginTop:     'clamp(16px, 2.5vw, 28px)',
        }}
      >
        This page doesn't exist
      </motion.p>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.38 }}
        style={{ marginTop: 'clamp(24px, 3.5vw, 40px)' }}
      >
        <Link
          href="/"
          style={{
            fontFamily:    'Geist, sans-serif',
            fontSize:      '14px',
            fontWeight:    500,
            color:         'var(--project-accent)',
            textDecoration: 'none',
            display:       'inline-flex',
            alignItems:    'center',
            gap:           '8px',
            letterSpacing: '-0.005em',
          }}
        >
          <span aria-hidden="true">←</span>
          Back home
        </Link>
      </motion.div>
    </main>
  );
}
