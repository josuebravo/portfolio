'use client';
import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion, AnimatePresence,
  useScroll, useTransform, useMotionValueEvent,
  useMotionValue, useSpring,
  type MotionValue,
} from 'framer-motion';

const TILT_SPRING = { stiffness: 180, damping: 22, mass: 0.6 };
import { useLang } from '@/components/LangProvider';
import { projects, Project } from '@/content/projects';
import { copy } from '@/content/copy';

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Reusable animation presets (blur + scale, staggered by delay) ─────────
function blurIn(delay = 0) {
  return {
    initial:    { opacity: 0, scale: 0.96, filter: 'blur(12px)' },
    animate:    { opacity: 1, scale: 1,    filter: 'blur(0px)'  },
    transition: { duration: 0.52, ease: EASE, delay },
  };
}
function slideBlurIn(delay = 0, axis: 'x' | 'y' = 'y', dist = 12) {
  return {
    initial:    { opacity: 0, [axis]: dist,  filter: 'blur(10px)' },
    animate:    { opacity: 1, [axis]: 0,     filter: 'blur(0px)'  },
    transition: { duration: 0.52, ease: EASE, delay },
  };
}

// ── Single project slide ──────────────────────────────────────────────────
function ProjectSlide({
  project, lang,
  glassX, glassY,
}: {
  project: Project;
  lang: 'en' | 'es';
  glassX: MotionValue<number>;
  glassY: MotionValue<number>;
}) {
  const href = `/work/${project.slug}`;

  // ── Local mouse tracking — relative to the image card ──────────────────
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);
  const springX = useSpring(localX, TILT_SPRING);
  const springY = useSpring(localY, TILT_SPRING);

  // 3-D tilt
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9,  9]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [ 7, -7]);

  // Image parallax — opposite direction for depth
  const imgParX = useTransform(springX, [-0.5, 0.5], ['5%', '-5%']);
  const imgParY = useTransform(springY, [-0.5, 0.5], ['3%', '-3%']);

  // Glare follows cursor
  const glareX = useTransform(springX, [-0.5, 0.5], ['15%', '85%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['15%', '85%']);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.10) 0%, transparent 60%)`,
  );

  const [cardHovered, setCardHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    localX.set((e.clientX - r.left) / r.width  - 0.5);
    localY.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const handleMouseLeave = () => {
    localX.set(0);
    localY.set(0);
    setCardHovered(false);
  };

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: EASE }}
      className="fw-slide-inner"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Centered content column */}
      <div style={{ width: '100%', maxWidth: '695px' }}>

        {/* Meta row */}
        <motion.p
          {...slideBlurIn(0, 'y', 10)}
          style={{
            fontFamily: 'GeistMono, monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--text-hero-dim)',
            textTransform: 'uppercase',
            marginBottom: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {project.number}&nbsp;·&nbsp;{project.industry[lang]}&nbsp;·&nbsp;{project.year}&nbsp;·&nbsp;{project.role[lang]}&nbsp;·&nbsp;{project.confidentiality[lang]}
        </motion.p>

        {/* Project title */}
        <motion.h3
          {...slideBlurIn(0.04, 'y', 8)}
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(18px, 2vw, 26px)',
            fontWeight: 700,
            color: 'var(--text-hero)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '14px',
          }}
        >
          {project.title[lang]}
        </motion.h3>

        {/* Image card — 3D tilt + parallax + glare */}
        <div style={{ position: 'relative' }}>
          {/* Entrance wrapper */}
          <motion.div {...blurIn(0.07)} style={{ position: 'relative' }}>

            {/* Perspective container */}
            <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>

              {/* Tilt layer */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  borderRadius: '20px',
                  willChange: 'transform',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                {/* Clip + Link */}
                <Link
                  href={href}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setCardHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    width: '100%',
                    aspectRatio: '695 / 424',
                    position: 'relative',
                  }}
                >
                  {/* Image — oversized for parallax headroom */}
                  <motion.div style={{
                    position: 'absolute',
                    top: '-6%', left: '-6%', right: '-6%', bottom: '-6%',
                    x: imgParX,
                    y: imgParY,
                  }}>
                    <Image
                      src={project.images.hero[0]}
                      alt={project.title[lang]}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 900px) 100vw, 695px"
                    />
                  </motion.div>

                  {/* Glare — follows cursor */}
                  <motion.div
                    animate={{ opacity: cardHovered ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: glareBg,
                      pointerEvents: 'none', zIndex: 1,
                    }}
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Glass hook card — overlaps image so backdrop-filter blurs image */}
          {/* NOTE: no filter animation on this wrapper — filter creates a stacking context
              that clips backdrop-filter, preventing it from seeing the image behind */}
          <div
            className="fw-glass"
            style={{
              position: 'absolute',
              left: 'clamp(-48px, -5vw, -72px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 4,
            }}
          >
            <motion.div
              initial={{ x: -28 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.10 }}
            >
              <motion.div
                style={{
                  x: glassX,
                  y: glassY,
                  width: 'clamp(180px, 22vw, 272px)',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '24px',
                  padding: 'clamp(18px, 1.8vw, 28px)',
                  boxShadow: 'var(--glass-shadow)',
                }}
              >
                <p style={{
                  fontFamily: 'Geist, sans-serif',
                  fontSize: 'clamp(14px, 1.4vw, 20px)',
                  fontWeight: 600,
                  color: 'var(--glass-text)',
                  lineHeight: 1.28,
                  letterSpacing: '-0.018em',
                }}>
                  {project.hook[lang]}
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Tags column — right of image, staggered entrance */}
          <div
            className="fw-tags-col"
            style={{
              position: 'absolute',
              right: 'clamp(-110px, -18vw, -170px)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'flex-start',
              zIndex: 4,
            }}
          >
            {project.tags.slice(0, 4).map((tag, i) => (
              <motion.span
                key={tag}
                {...slideBlurIn(0.14 + i * 0.06, 'x', 14)}
                style={{
                  fontFamily: 'GeistMono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.10em',
                  color: 'var(--text-hero-dim)',
                  textTransform: 'uppercase',
                  background: 'var(--bg-hero)',
                  border: '1px solid var(--tag-border)',
                  padding: '6px 13px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Mobile tags row */}
        <div
          className="fw-tags-row"
          style={{ display: 'none', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}
        >
          {project.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '9.5px',
                letterSpacing: '0.09em',
                color: 'var(--tag-text)',
                textTransform: 'uppercase',
                background: 'rgba(149,149,149,0.10)',
                border: '1px solid var(--tag-border)',
                padding: '5px 11px',
                borderRadius: '999px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <motion.p
          {...slideBlurIn(0.2, 'y', 8)}
          style={{
            fontFamily: 'Geist, sans-serif',
            fontSize: 'clamp(13px, 1.05vw, 14.5px)',
            color: 'var(--text-hero-muted)',
            lineHeight: 1.68,
            marginTop: '18px',
            letterSpacing: '-0.005em',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}
        >
          {project.overview[lang]}
        </motion.p>


      </div>
    </motion.div>
  );
}

// ── FeaturedWork ─────────────────────────────────────────────────────────────
export default function FeaturedWork() {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll-driven project switching
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveIndex(Math.min(Math.floor(v * projects.length), projects.length - 1));
  });

  // Stepper fill — scaleY driven by scroll, pixel-perfect regardless of item heights
  const N = projects.length;
  const vInputs    = [0, ...Array.from({ length: N }, (_, i) => (i + 1) / N)];
  const scaleOuts  = [0, ...Array.from({ length: N - 1 }, (_, i) => (i + 1) / (N - 1)), 1];
  const fillScale  = useTransform(scrollYProgress, vInputs, scaleOuts);

  // Mouse parallax — persists across project transitions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 60, damping: 18, mass: 0.6 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);
  // Glass card + tags still use the global section mouse
  const glassX = useTransform(smoothX, [-1, 1], [ 22, -22]);
  const glassY = useTransform(smoothY, [-1, 1], [ 14, -14]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width  * 2 - 1);
    mouseY.set((e.clientY - r.top)  / r.height * 2 - 1);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const t = copy[lang].projects;

  return (
    <section id="projects" style={{ background: 'var(--bg-hero)' }}>

      {/* Section header — static, no animation to avoid scroll dead zone */}
      <div
        style={{
          padding: 'clamp(32px, 4vw, 56px) clamp(24px, 5vw, 60px) clamp(20px, 3vw, 36px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--stats-divider)',
        }}
      >
        <div>
          <h2 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(28px, 4.5vw, 64px)',
            fontWeight: 900,
            color: 'var(--text-hero)',
            letterSpacing: '-0.035em',
            lineHeight: 0.96,
          }}>
            {t.sectionIntro}
          </h2>
        </div>
        <Link
          href="/work"
          className="link-muted"
          style={{
            fontFamily: 'Geist, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-hero-dim)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            marginBottom: '4px',
          }}
        >
          {lang === 'en' ? 'All projects' : 'Todos los proyectos'}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Sticky scroll container — 75vh per project keeps scroll compact */}
      <div
        ref={containerRef}
        style={{ height: `${projects.length * 75}vh`, position: 'relative' }}
      >
        {/* Sticky panel — no overflow:hidden so glass + tags bleed out cleanly */}
        <div
          ref={stickyRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >

          {/* Project stepper — vertical track + progress fill */}
          <div
            className="fw-index"
            style={{
              position: 'absolute',
              left: 'clamp(20px, 3.6vw, 52px)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              zIndex: 10,
            }}
          >
            {/* Track wrapper — relative so the line can be positioned inside */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Background track — full height, dim */}
              <div style={{
                position: 'absolute',
                left: 3,
                top: 6,
                bottom: 6,
                width: '1px',
                background: 'var(--stats-divider)',
              }} />

              {/* Progress fill — scaleY driven by scrollYProgress, origin top */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: 3,
                  top: 6,
                  bottom: 6,
                  width: '1px',
                  background: 'var(--project-accent)',
                  transformOrigin: 'top',
                  scaleY: fillScale,
                }}
              />

              {/* Items */}
              {projects.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                  {/* Dot on track */}
                  <motion.div
                    animate={{
                      width:   activeIndex === i ? 7 : 5,
                      height:  activeIndex === i ? 7 : 5,
                      opacity: activeIndex === i ? 1 : 0.32,
                      backgroundColor: activeIndex === i
                        ? 'var(--project-accent)'
                        : 'var(--text-hero-dim)',
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ borderRadius: '50%', flexShrink: 0 }}
                  />

                  {/* Number */}
                  <motion.span
                    animate={{
                      opacity:    activeIndex === i ? 1 : 0.28,
                      fontWeight: activeIndex === i ? 500 : 300,
                    }}
                    transition={{ duration: 0.35 }}
                    style={{
                      fontFamily: 'GeistMono, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      lineHeight: 1,
                      color: activeIndex === i ? 'var(--project-accent)' : 'var(--text-hero-dim)',
                    }}
                  >
                    {p.number}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated project slides */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
            <AnimatePresence mode="wait">
              <ProjectSlide
                key={activeIndex}
                project={projects[activeIndex]}
                lang={lang}
                glassX={glassX}
                glassY={glassY}
              />
            </AnimatePresence>
          </div>

          {/* View all — matches "All work →" header link style */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(72px, 9vh, 90px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}>
            <Link
              href="/work"
              className="link-muted"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-hero-dim)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {lang === 'en' ? 'All projects' : 'Todos los proyectos'}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Scroll progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--stats-divider)',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'var(--project-accent)',
                scaleX: scrollYProgress,
                transformOrigin: 'left',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
