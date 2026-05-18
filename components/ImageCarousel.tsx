'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;
const INTERVAL = 4000; // ms between auto-advances

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent]     = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered]     = useState(false);
  const [progress, setProgress]   = useState(0); // 0–100
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt   = useRef<number>(Date.now());

  if (images.length === 0) return null;

  // ─── navigation helpers ───────────────────────────────────────────────────

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
    setProgress(0);
    startedAt.current = Date.now();
  }, []);

  const prev = () => {
    const idx = (current - 1 + images.length) % images.length;
    goTo(idx, -1);
  };

  const next = useCallback(() => {
    const idx = (current + 1) % images.length;
    goTo(idx, 1);
  }, [current, images.length, goTo]);

  // ─── auto-advance + progress bar ─────────────────────────────────────────

  useEffect(() => {
    if (images.length <= 1) return;

    const clearAll = () => {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };

    if (hovered) {
      clearAll();
      return;
    }

    startedAt.current = Date.now();
    setProgress(0);

    // smooth progress update every 40ms
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
    }, 40);

    // advance slide
    timerRef.current = setInterval(() => {
      next();
    }, INTERVAL);

    return clearAll;
  }, [hovered, current, images.length, next]);

  // ─── single image ─────────────────────────────────────────────────────────

  if (images.length === 1) {
    return (
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 1200px) 100vw, 1100px"
        />
      </div>
    );
  }

  // ─── slide variants ───────────────────────────────────────────────────────

  const variants = {
    enter: (_dir: number) => ({
      opacity: 0,
    }),
    center: {
      opacity: 1,
      transition: { duration: 0.9, ease: 'easeInOut' },
    },
    exit: (_dir: number) => ({
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    }),
  };

  const btnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(7,5,26,0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(238,238,236,0.18)',
    cursor: 'pointer',
    color: '#EEEEEC',
    outline: 'none',
    padding: 0,
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.22s ease',
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={images[current]}
              alt={`${alt} — ${current + 1} / ${images.length}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1200px) 100vw, 1100px"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev button — visible on hover */}
        <button
          onClick={prev}
          aria-label="Previous image"
          style={{ ...btnStyle, left: '16px' }}
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
        </button>

        {/* Next button — visible on hover */}
        <button
          onClick={next}
          aria-label="Next image"
          style={{ ...btnStyle, right: '16px' }}
        >
          <ChevronRight size={18} strokeWidth={1.8} />
        </button>
      </div>

      {/* Dot indicators with progress ring on active */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to image ${i + 1}`}
            style={{
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Active dot: pill with progress fill */}
            {i === current ? (
              <div style={{
                position: 'relative',
                width: '36px',
                height: '6px',
                borderRadius: '999px',
                background: 'var(--stats-divider)',
                overflow: 'hidden',
              }}>
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'var(--project-accent)',
                    scaleX: progress / 100,
                    transformOrigin: 'left center',
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '999px',
                background: 'var(--stats-divider)',
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
