'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLang } from '@/components/LangProvider';

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── ScrollCue ────────────────────────────────────────────────────────────────

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.4 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
    >
      <span style={{
        fontFamily: 'GeistMono, monospace',
        fontSize: '9px',
        letterSpacing: '0.14em',
        color: 'var(--text-hero-dim)',
        textTransform: 'uppercase',
      }}>
        Scroll
      </span>
      <div style={{ position: 'relative', width: '1px', height: '36px', background: 'var(--text-hero-dim)' }}>
        <motion.div
          style={{ position: 'absolute', top: 0, left: 0, width: '1px', background: 'var(--text-hero-muted)' }}
          animate={{ height: ['0%', '100%', '100%'], top: ['0%', '0%', '100%'], opacity: [1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.7, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

// ─── MagneticLetter ───────────────────────────────────────────────────────────

function MagneticLetter({
  char,
  charStyle,
  mouse,
  enabled,
  isAccent,
}: {
  char: string;
  charStyle: React.CSSProperties;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  enabled: boolean;
  isAccent?: boolean;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const x      = useSpring(rawX, { stiffness: 190, damping: 18, mass: 0.45 });
  const y      = useSpring(rawY, { stiffness: 190, damping: 18, mass: 0.45 });

  useEffect(() => {
    if (!enabled) { rawX.set(0); rawY.set(0); return; }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId: number;

    const update = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = mouse.current.x - cx;
        const dy   = mouse.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Scale with viewport so large letterforms feel right
        const RADIUS   = Math.min(window.innerWidth * 0.075, 135);
        const STRENGTH = Math.min(window.innerWidth * 0.032, 48);

        if (dist < RADIUS && dist > 0) {
          const force = 1 - dist / RADIUS;
          rawX.set(-(dx / dist) * force * STRENGTH);
          rawY.set(-(dy / dist) * force * STRENGTH);
        } else {
          rawX.set(0);
          rawY.set(0);
        }
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, rawX, rawY, mouse]);

  return (
    <motion.span
      ref={ref}
      style={{
        ...charStyle,
        x, y,
        display: 'inline-block',
        color: isAccent ? 'var(--project-accent)' : 'var(--text-hero)',
      }}
    >
      {char}
    </motion.span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { lang }  = useLang();
  const mouse     = useRef({ x: -9999, y: -9999 });
  const [magneticEnabled, setMagneticEnabled] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spX  = useSpring(rawX, { stiffness: 55, damping: 20 });
  const spY  = useSpring(rawY, { stiffness: 55, damping: 20 });
  const nameX  = useTransform(spX, [-1, 1], [-10,  10]);
  const nameY  = useTransform(spY, [-1, 1], [ -6,   6]);
  const greetX = useTransform(spX, [-1, 1], [  5,  -5]);
  const greetY = useTransform(spY, [-1, 1], [  3,  -3]);

  // Single mousemove listener feeds both parallax and magnetic
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2));
      rawY.set((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2));
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  // Enable magnetic + particles once the name reveal finishes (~1.7s)
  useEffect(() => {
    const t = setTimeout(() => setMagneticEnabled(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const greetLabel  = lang === 'en' ? 'Hi!'  : '¡Hola!';
  const greetBridge = lang === 'en' ? "I'm"  : 'Soy';
  const nameLines   = ['Josue', 'Bravo.'];
  const descriptor  = lang === 'en'
    ? 'Lead UX · AI Products · Enterprise · Behavioral Design'
    : 'Lead UX · Productos IA · Enterprise · Diseño Conductual';

  // Shared typographic style for every character span
  const charStyle: React.CSSProperties = {
    fontFamily:    'Sora, sans-serif',
    fontSize:      'clamp(72px, 23.5vw, 520px)',
    fontWeight:    900,
    lineHeight:    0.84,
    letterSpacing: '-0.04em',
    whiteSpace:    'nowrap',
  };

  return (
    <section
      style={{
        position:      'relative',
        minHeight:     '100svh',
        display:       'flex',
        flexDirection: 'column',
        padding:       'clamp(64px, 10vh, 96px) clamp(20px, 4vw, 56px) 0',
        overflow:      'hidden',
      }}
    >
      {/* ── All content ── */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Tier 1 — greeting label */}
        <motion.div
          style={{ x: greetX, y: greetY }}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}
        >
          <p style={{
            fontFamily:    'GeistMono, monospace',
            fontSize:      'clamp(10px, 0.85vw, 11px)',
            fontWeight:    400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--project-accent)',
            lineHeight:    1,
            marginBottom:  'clamp(5px, 0.7vw, 9px)',
          }}>
            {greetLabel}
          </p>
        </motion.div>

        {/* Tier 2 — "I'm" bridge */}
        <div className="clip-overflow" style={{ marginBottom: 'clamp(2px, 0.3vw, 4px)' }}>
          <motion.p
            initial={{ y: '108%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.14 }}
            style={{
              fontFamily:    'Sora, sans-serif',
              fontSize:      'clamp(26px, 3.4vw, 50px)',
              fontWeight:    300,
              color:         'var(--text-hero-muted)',
              lineHeight:    0.96,
              letterSpacing: '-0.025em',
            }}
          >
            {greetBridge}
          </motion.p>
        </div>

        {/* ── Name — per-character magnetic repulsion ── */}
        <motion.div
          aria-label="Josue Bravo"
          style={{ x: nameX, y: nameY }}
        >
          {nameLines.map((line, lineIdx) => (
            <div
              key={lineIdx}
              // overflow: visible once magnetic is active so letters aren't clipped
              style={{ overflow: magneticEnabled ? 'visible' : 'hidden' }}
            >
              <motion.div
                initial={{ y: '108%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.15, ease: EASE, delay: 0.26 + lineIdx * 0.14 }}
                style={{ display: 'block' }}
              >
                <h1 style={{
                  fontFamily:    'Sora, sans-serif',
                  fontSize:      'clamp(72px, 23.5vw, 520px)',
                  fontWeight:    900,
                  lineHeight:    0.84,
                  letterSpacing: '-0.04em',
                  display:       'block',
                  whiteSpace:    'nowrap',
                  color:         'var(--text-hero)', // fallback / a11y
                }}>
                  {line.split('').map((char, charIdx) => {
                    const isDot = lineIdx === 1 && charIdx === line.length - 1;
                    return (
                      <MagneticLetter
                        key={charIdx}
                        char={char}
                        charStyle={charStyle}
                        mouse={mouse}
                        enabled={magneticEnabled}
                        isAccent={isDot}
                      />
                    );
                  })}
                </h1>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Descriptor */}
        <motion.p
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.64 }}
          style={{
            fontFamily:    'GeistMono, monospace',
            fontSize:      'clamp(10px, 0.85vw, 11px)',
            fontWeight:    400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         'var(--text-hero-dim)',
            marginTop:     'clamp(20px, 2.8vh, 36px)',
            lineHeight:    1,
          }}
        >
          {descriptor}
        </motion.p>

        {/* Bottom metadata bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.72, ease: EASE }}
          style={{
            marginTop:      'auto',
            borderTop:      '1px solid var(--stats-divider)',
            padding:        'clamp(14px, 2vh, 22px) 0 clamp(72px, 11vh, 96px)',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'flex-end',
            gap:            '12px',
          }}
        >
          {/* Left */}
          <span style={{
            fontFamily:    'GeistMono, monospace',
            fontSize:      '11px',
            letterSpacing: '0.10em',
            color:         'var(--text-hero-dim)',
            textTransform: 'uppercase',
          }}>
            {lang === 'en' ? 'Mexico City' : 'Ciudad de México'}
          </span>

          {/* Center */}
          <ScrollCue />

          {/* Right — availability */}
          <span style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           '7px',
            fontFamily:    'GeistMono, monospace',
            fontSize:      '11px',
            letterSpacing: '0.10em',
            color:         'var(--project-accent)',
            textTransform: 'uppercase',
          }}>
            <span className="avail-dot" />
            {lang === 'en' ? 'Available' : 'Disponible'}
          </span>
        </motion.div>

      </div>
    </section>
  );
}
