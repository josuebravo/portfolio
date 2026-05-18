'use client';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagneticLetter({
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
  const ref  = useRef<HTMLSpanElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, { stiffness: 190, damping: 18, mass: 0.45 });
  const y    = useSpring(rawY, { stiffness: 190, damping: 18, mass: 0.45 });

  useEffect(() => {
    if (!enabled) { rawX.set(0); rawY.set(0); return; }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId: number;

    const update = () => {
      const el = ref.current;
      if (el) {
        const rect   = el.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = mouse.current.x - cx;
        const dy     = mouse.current.y - cy;
        const dist   = Math.sqrt(dx * dx + dy * dy);
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
