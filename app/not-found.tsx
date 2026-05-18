'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MagneticLetter } from '@/components/MagneticLetter';

const EASE = [0.16, 1, 0.3, 1] as const;
const CHARS: { char: string; isAccent?: boolean }[] = [
  { char: '4' },
  { char: '0', isAccent: true },
  { char: '4' },
];

const charStyle: React.CSSProperties = {
  fontFamily:    'Sora, sans-serif',
  fontSize:      'clamp(100px, 22vw, 300px)',
  fontWeight:    900,
  letterSpacing: '-0.04em',
  lineHeight:    0.84,
  whiteSpace:    'nowrap',
};

export default function NotFound() {
  const mouse   = useRef({ x: -9999, y: -9999 });
  const [ready, setReady] = useState(false);

  // Track mouse globally
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Enable magnetic after entrance animation
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{
      minHeight:      '100svh',
      background:     'var(--bg-hero)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        'clamp(40px, 8vw, 80px)',
    }}>

      {/* 404 — magnetic characters */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ overflow: ready ? 'visible' : 'hidden' }}
      >
        <div style={{ lineHeight: 0.84 }}>
          {CHARS.map(({ char, isAccent }, i) => (
            <MagneticLetter
              key={i}
              char={char}
              charStyle={charStyle}
              mouse={mouse}
              enabled={ready}
              isAccent={isAccent}
              shuffle
              introDelay={i * 55}
            />
          ))}
        </div>
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
            fontFamily:     'Geist, sans-serif',
            fontSize:       '14px',
            fontWeight:     500,
            color:          'var(--project-accent)',
            textDecoration: 'none',
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '8px',
            letterSpacing:  '-0.005em',
          }}
        >
          <span aria-hidden="true">←</span>
          Back home
        </Link>
      </motion.div>

    </main>
  );
}
