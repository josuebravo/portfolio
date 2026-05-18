'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const POOL     = '!"#$%&/()=?;:-[]{}*¨´+<>'.split('');
const CYCLES   = 9;
const INTERVAL = 170; // ms per symbol
const TRANS    = { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const };

export function MagneticLetter({
  char,
  charStyle,
  mouse,
  enabled,
  isAccent,
  shuffle = false,
  introDelay = 0,
}: {
  char: string;
  charStyle: React.CSSProperties;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  enabled: boolean;
  isAccent?: boolean;
  shuffle?: boolean;
  introDelay?: number;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const x      = useSpring(rawX, { stiffness: 190, damping: 18, mass: 0.45 });
  const y      = useSpring(rawY, { stiffness: 190, damping: 18, mass: 0.45 });

  const [displayChar, setDisplayChar] = useState(char);
  const tickRef      = useRef(0);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const introFiredRef = useRef(false);

  // ── Magnetic rAF ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) { rawX.set(0); rawY.set(0); return; }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId: number;
    const update = () => {
      const el = ref.current;
      if (el) {
        const rect     = el.getBoundingClientRect();
        const cx       = rect.left + rect.width  / 2;
        const cy       = rect.top  + rect.height / 2;
        const dx       = mouse.current.x - cx;
        const dy       = mouse.current.y - cy;
        const dist     = Math.sqrt(dx * dx + dy * dy);
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

  // ── Core shuffle logic (shared by intro + hover) ──────────────────────────
  const runShuffle = (cycles = CYCLES) => {
    if (timerRef.current) clearInterval(timerRef.current);
    tickRef.current = 0;
    timerRef.current = setInterval(() => {
      tickRef.current++;
      if (tickRef.current >= cycles) {
        setDisplayChar(char);
        clearInterval(timerRef.current!);
        timerRef.current = null;
      } else {
        let next: string;
        do { next = POOL[Math.floor(Math.random() * POOL.length)]; }
        while (next === char);
        setDisplayChar(next);
      }
    }, INTERVAL);
  };

  // ── Intro shuffle — fires once when enabled becomes true ─────────────────
  useEffect(() => {
    if (!enabled || !shuffle || introFiredRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    introFiredRef.current = true;

    const t = setTimeout(() => runShuffle(4), introDelay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // ── Hover shuffle ─────────────────────────────────────────────────────────
  const startShuffle = () => {
    if (!enabled || !shuffle) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    runShuffle(CYCLES);
  };

  const stopShuffle = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setDisplayChar(char);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  const color = isAccent ? 'var(--project-accent)' : 'var(--text-hero)';

  return (
    <motion.span
      ref={ref}
      onMouseEnter={startShuffle}
      onMouseLeave={stopShuffle}
      style={{ ...charStyle, x, y, display: 'inline-block', color, position: 'relative' }}
    >
      {shuffle ? (
        /* No overflow:hidden — glyphs are never clipped.
           Slot feel comes from translateY + opacity together. */
        <span style={{ display: 'inline-block', position: 'relative' }}>
          {/* Ghost keeps the original char's width so layout never reflows */}
          <span style={{ visibility: 'hidden', display: 'block', lineHeight: 'inherit' }}>
            {char}
          </span>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={displayChar === char ? 'original' : `${displayChar}-${tickRef.current}`}
              initial={{ y: '75%',  opacity: 0 }}
              animate={{ y: '0%',   opacity: 1 }}
              exit={{    y: '-75%', opacity: 0 }}
              transition={TRANS}
              style={{
                position:   'absolute',
                top:        0,
                left:       0,
                right:      0,
                lineHeight: 'inherit',
                display:    'block',
              }}
            >
              {displayChar}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : (
        char
      )}
    </motion.span>
  );
}
