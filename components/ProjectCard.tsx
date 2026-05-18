'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useMotionValue, useSpring, useTransform,
  useScroll,
} from 'framer-motion';
import { useLang } from '@/components/LangProvider';
import type { Project } from '@/content/projects';

const EASE = [0.16, 1, 0.3, 1] as const;

// Spring config shared across tilt + parallax
const SPRING = { stiffness: 180, damping: 22, mass: 0.6 };

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const { lang } = useLang();
  const [hovered, setHovered] = useState(false);
  const href = `/work/${project.slug}`;
  const heroImage = project.images.hero[0];

  // ── Refs ─────────────────────────────────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Scroll-based parallax (background drift while scrolling) ─────────────
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const scrollY = useSpring(
    useTransform(scrollYProgress, [0, 1], ['6%', '-6%']),
    { stiffness: 60, damping: 20, mass: 0.4 },
  );

  // ── Mouse tracking (normalized –0.5 → 0.5 from center) ───────────────────
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const mouseX = useSpring(rawMouseX, SPRING);
  const mouseY = useSpring(rawMouseY, SPRING);

  // Card 3-D tilt — subtle, max ±9°
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);

  // Image parallax — opposite direction = depth illusion
  const imgX = useTransform(mouseX, [-0.5, 0.5], ['4%', '-4%']);
  const imgY = useTransform(mouseY, [-0.5, 0.5], ['3%', '-3%']);

  // Glare highlight — radial gradient follows the cursor
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.11) 0%, transparent 62%)`,
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
    setHovered(false);
  };

  return (
    // Perspective wrapper — gives 3-D depth to children
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: EASE }}
      style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
    >
      {/* Tilt wrapper */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: '12px',
          willChange: 'transform',
        }}
      >
        <Link
          href={href}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            textDecoration: 'none',
            aspectRatio: featured ? '21 / 9' : '4 / 3',
            background: 'var(--bg-hero-alt)',
          }}
        >
          {/* ── Image — scroll parallax + mouse parallax + hover zoom ──── */}
          {/* Oversized so drift never reveals edges */}
          <motion.div
            style={{
              position: 'absolute',
              top: '-8%', left: '-8%', right: '-8%', bottom: '-8%',
              y: scrollY,      // scroll drift
              x: imgX,         // mouse horizontal parallax
            }}
          >
            <motion.div
              style={{ position: 'absolute', inset: 0, y: imgY }}  // mouse vertical parallax
            >
              <motion.div
                animate={{ scale: hovered ? 1.03 : 1 }}
                transition={{ duration: 0.65, ease: EASE }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  src={heroImage}
                  alt={project.title[lang]}
                  fill
                  sizes={
                    featured
                      ? '(max-width: 768px) 100vw, (max-width: 1400px) calc(100vw - 112px), 1288px'
                      : '(max-width: 768px) 100vw, (max-width: 1400px) calc(50vw - 66px), 634px'
                  }
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority={index === 0}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Permanent bottom gradient ─────────────────────────────── */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(7,5,26,0.82) 0%, rgba(7,5,26,0.30) 40%, transparent 68%)',
              pointerEvents: 'none', zIndex: 1,
            }}
          />

          {/* ── Glare / shine — follows cursor ───────────────────────── */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', inset: 0,
              background: glareBackground,
              pointerEvents: 'none', zIndex: 2,
            }}
          />

          {/* ── Hover dark overlay ────────────────────────────────────── */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(7, 5, 26, 0.38)',
              pointerEvents: 'none', zIndex: 3,
            }}
          />

          {/* ── Number badge + Lab tag — top left ─────────────────────── */}
          <div
            style={{
              position: 'absolute', top: '18px', left: '20px',
              zIndex: 4, display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <span style={{
              fontFamily: 'GeistMono, monospace', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.08em', color: 'rgba(238,238,236,0.50)', lineHeight: 1,
            }}>
              {project.number}
            </span>
            {project.isLab && (
              <span style={{
                fontFamily: 'GeistMono, monospace', fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.10em', color: '#00CFBA',
                padding: '2px 7px', borderRadius: '999px',
                border: '1px solid rgba(0,207,186,0.30)',
                background: 'rgba(0,207,186,0.08)', lineHeight: 1.6,
              }}>
                LAB
              </span>
            )}
          </div>

          {/* ── Arrow circle — slides in from corner on hover ─────────── */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8, y: hovered ? 0 : -8 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{
              position: 'absolute', top: '14px', right: '16px', zIndex: 4,
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(238,238,236,0.14)',
              border: '1px solid rgba(238,238,236,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#EEEEEC',
            }}
          >
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </motion.div>

          {/* ── Bottom content ────────────────────────────────────────── */}
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: featured ? '32px 28px 26px' : '24px 22px 20px',
              zIndex: 4, display: 'flex', flexDirection: 'column', gap: '8px',
            }}
          >
            {/* Hook + metric — slides up on hover */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
              transition={{ duration: 0.32, delay: hovered ? 0.04 : 0, ease: EASE }}
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <p style={{
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: featured ? 'clamp(13px, 1.05vw, 15px)' : '13px',
                fontWeight: 400, color: 'rgba(238,238,236,0.68)',
                lineHeight: 1.5, margin: 0, maxWidth: '520px',
              }}>
                {project.hook[lang]}
              </p>
              {project.metrics[0] && (
                <p style={{
                  fontFamily: 'GeistMono, monospace', fontSize: '11px', fontWeight: 500,
                  color: '#00CFBA', letterSpacing: '0.04em', margin: 0,
                }}>
                  {project.metrics[0].value}&nbsp;{project.metrics[0].label[lang]}
                </p>
              )}
            </motion.div>

            {/* Title + tags */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: featured ? 'clamp(20px, 2.2vw, 30px)' : 'clamp(16px, 1.5vw, 21px)',
                fontWeight: 700, color: '#EEEEEC',
                letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0,
              }}>
                {project.title[lang]}
              </h2>
              {featured && (
                <div className="hidden sm:flex" style={{ gap: '6px', flexShrink: 0, alignItems: 'center' }}>
                  {project.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'GeistMono, monospace', fontSize: '10px', fontWeight: 400,
                      letterSpacing: '0.04em', color: 'rgba(238,238,236,0.50)',
                      padding: '3px 9px', borderRadius: '999px',
                      border: '1px solid rgba(238,238,236,0.14)', whiteSpace: 'nowrap',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Industry · Year */}
            <span style={{
              fontFamily: 'GeistMono, monospace', fontSize: '10px', fontWeight: 400,
              letterSpacing: '0.06em', color: 'rgba(238,238,236,0.35)', lineHeight: 1,
            }}>
              {project.industry[lang]}&nbsp;·&nbsp;{project.year}
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
