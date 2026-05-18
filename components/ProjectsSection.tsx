'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/components/LangProvider';
import { copy } from '@/content/copy';
import { projects } from '@/content/projects';
import WorkListItem from '@/components/WorkListItem';

export default function ProjectsSection() {
  const { lang } = useLang();
  const t = copy[lang].projects;

  return (
    <section id="projects" className="relative bg-field-light py-28 px-6">
      <div className="max-w-content mx-auto">

        {/* ── Section header ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '64px',
            gap: '24px',
          }}
        >
          <div>
            <p style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.11em',
              color: 'rgba(20,18,42,0.35)',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              {t.sectionLabel}
            </p>
            <h2 style={{
              fontFamily: 'Geist, system-ui, sans-serif',
              fontSize: 'clamp(26px, 2.8vw, 38px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.18,
              color: '#14122A',
              maxWidth: '500px',
              margin: 0,
            }}>
              {t.sectionIntro}
            </h2>
          </div>

          {/* Ghost number */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(72px, 9vw, 112px)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              color: 'rgba(20,18,42,0.05)',
              lineHeight: 1,
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {String(projects.length).padStart(2, '0')}
          </span>
        </motion.div>

        {/* ── Editorial list ───────────────────────────────────── */}
        <div>
          {projects.map((project, i) => (
            <WorkListItem key={project.id} project={project} index={i} />
          ))}
          {/* Closing rule */}
          <div style={{ borderTop: '1px solid rgba(20,18,42,0.07)' }} />
        </div>
      </div>
    </section>
  );
}
