'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Dot — fast, near-instant
  const dotX = useSpring(mx, { stiffness: 700, damping: 38, mass: 0.4 });
  const dotY = useSpring(my, { stiffness: 700, damping: 38, mass: 0.4 });

  // Ring — lags behind for depth
  const ringX = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 110, damping: 20, mass: 0.6 });

  useEffect(() => {
    // Gate cursor:none CSS so the default cursor is visible until this component is ready
    document.documentElement.classList.add('custom-cursor-ready');

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onHover = (e: MouseEvent) => {
      const t = e.target as Element;
      setHovered(!!t.closest('a, button, [role="button"]'));
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onHover);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onHover);
      document.documentElement.classList.remove('custom-cursor-ready');
    };
  }, [mx, my, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Ring */}
      <motion.div
        aria-hidden="true"
        animate={{
          width: hovered ? 52 : 36,
          height: hovered ? 52 : 36,
          opacity: hovered ? 0.75 : 0.45,
        }}
        transition={{ duration: 0.22 }}
        style={{
          position: 'fixed',
          zIndex: 9998,
          top: 0, left: 0,
          borderRadius: '50%',
          border: '1px solid #FFFFFF',
          pointerEvents: 'none',
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          x: ringX,
          y: ringY,
        }}
      />
      {/* Dot */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: hovered ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: '#FFFFFF',
          pointerEvents: 'none',
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          x: dotX,
          y: dotY,
        }}
      />
    </>
  );
}
