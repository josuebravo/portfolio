'use client';
import { motion } from 'framer-motion';
import FloatingNav from '@/components/FloatingNav';
import HeroBg from '@/components/HeroBg';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/content/projects';
import { useLang } from '@/components/LangProvider';
import { copy } from '@/content/copy';

const EASE = [0.16, 1, 0.3, 1] as const;

// Layout: 01 featured (full-width), 02+03 side-by-side, 04 featured (full-width)
const FEATURED_IDS = new Set(['quoting-rewired', 'xolodrilo']);

export default function WorkPage() {
  const { lang } = useLang();
  const t = copy[lang];

  return (
    <>
      <FloatingNav />

      {/* ── Page header — mirrors hero visual system ────────────────── */}
      <div
        style={{
          background: 'var(--bg-hero)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop:    'clamp(76px, 11vw, 136px)',
          paddingBottom: 'clamp(52px, 7vw, 88px)',
          paddingLeft:   'clamp(20px, 4vw, 56px)',
          paddingRight:  'clamp(20px, 4vw, 56px)',
        }}
      >
        <HeroBg />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}
            style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: 'clamp(10px, 0.85vw, 11px)',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--project-accent)',
              lineHeight: 1,
              marginBottom: 'clamp(14px, 1.8vw, 22px)',
            }}
          >
            {t.projects.sectionLabel}
          </motion.p>

          {/* Headline — clip reveal */}
          <div className="clip-overflow">
            <motion.h1
              initial={{ y: '108%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.14 }}
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(40px, 7vw, 108px)',
                fontWeight: 900,
                color: 'var(--text-hero)',
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              {t.projects.sectionIntro}
            </motion.h1>
          </div>

        </div>
      </div>

      {/* ── Project grid ──────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-hero)',
          paddingLeft:   'clamp(20px, 4vw, 56px)',
          paddingRight:  'clamp(20px, 4vw, 56px)',
          paddingBottom: 'clamp(80px, 10vw, 120px)',
        }}
      >
        <div
          style={{
            maxWidth: '1288px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(12px, 1.4vw, 20px)',
          }}
          className="project-work-grid"
        >
          {projects.map((project, i) => {
            const isFeatured = FEATURED_IDS.has(project.id);
            return (
              <div
                key={project.id}
                style={{
                  gridColumn: isFeatured ? '1 / -1' : 'span 1',
                }}
              >
                <ProjectCard project={project} index={i} featured={isFeatured} />
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
