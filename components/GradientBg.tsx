'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GradientBgProps {
  inverted?: boolean;
  className?: string;
}

export default function GradientBg({ inverted = false, className = '' }: GradientBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const e1Ref = useRef<HTMLDivElement>(null);
  const e2Ref = useRef<HTMLDivElement>(null);
  const e3Ref = useRef<HTMLDivElement>(null);
  const e4Ref = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      const ellipses = [
        { ref: e1Ref, speed: 0.15 },
        { ref: e2Ref, speed: 0.10 },
        { ref: e3Ref, speed: 0.08 },
        { ref: e4Ref, speed: 0.05 },
      ];
      ellipses.forEach(({ ref, speed }) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          y: () => ScrollTrigger.maxScroll(window) * speed * -1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Staggered fade-in to spec opacities
  useEffect(() => {
    const targets = [
      { ref: e1Ref, to: 0.75 },
      { ref: e2Ref, to: 0.30 },
      { ref: e3Ref, to: 0.35 },
      { ref: e4Ref, to: 0.45 },  // reduced — was washing out lower hero
    ];
    targets.forEach(({ ref, to }, i) => {
      if (!ref.current) return;
      gsap.fromTo(ref.current,
        { opacity: 0 },
        { opacity: to, duration: 0.8, delay: 0.3 + i * 0.2, ease: 'power2.out' }
      );
    });
  }, []);

  const ellipseBase = 'absolute rounded-[50%]';

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ transform: inverted ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      {/* Ellipse 1 — Indigo base */}
      <div
        ref={e1Ref}
        className={ellipseBase}
        style={{
          width: '1282px', height: '1200px',
          left: '50%', top: '-100px',
          transform: 'translateX(-50%)',
          background: '#200392',
          filter: 'blur(200px)',
          opacity: 0,
        }}
      />
      {/* Ellipse 2 — Magenta */}
      <div
        ref={e2Ref}
        className={ellipseBase}
        style={{
          width: '878px', height: '1000px',
          left: '50%', top: '0px',
          transform: 'translateX(-52%)',
          background: '#FF00FF',
          filter: 'blur(150px)',
          opacity: 0,
        }}
      />
      {/* Ellipse 3 — Teal */}
      <div
        ref={e3Ref}
        className={ellipseBase}
        style={{
          width: '1142px', height: '900px',
          left: '50%', top: '80px',
          transform: 'translateX(-52%)',
          background: '#00CFBA',
          filter: 'blur(150px)',
          opacity: 0,
        }}
      />
      {/* Ellipse 4 — Field Light fade (pushed lower to keep hero dark) */}
      <div
        ref={e4Ref}
        className={ellipseBase}
        style={{
          width: '1846px', height: '900px',
          left: '50%', top: '480px',
          transform: 'translateX(-50%)',
          background: '#EEEEEC',
          filter: 'blur(180px)',
          opacity: 0,
        }}
      />
    </div>
  );
}
