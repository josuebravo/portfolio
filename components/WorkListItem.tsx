'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/components/LangProvider';
import type { Project } from '@/content/projects';

export default function WorkListItem({ project, index }: { project: Project; index: number }) {
  const { lang } = useLang();
  const [hovered, setHovered] = useState(false);
  const href = `/work/${project.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderTop: '1px solid var(--stats-divider)' }}
    >
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '28px 0',
          textDecoration: 'none',
          position: 'relative',
        }}
      >
        {/* Hover bg — uses accent var, theme-aware */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'absolute',
            inset: '0 -24px',
            background: 'var(--hover-row-bg)',
            borderRadius: '12px',
            pointerEvents: 'none',
          }}
        />

        {/* Number */}
        <span style={{
          fontFamily: 'GeistMono, monospace',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: hovered ? 'var(--project-accent)' : 'var(--text-hero-dim)',
          minWidth: '24px',
          flexShrink: 0,
          position: 'relative',
          transition: 'color 0.22s ease',
          opacity: hovered ? 1 : 0.45,
        }}>
          {project.number}
        </span>

        {/* Hook / title */}
        <h3 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 'clamp(16px, 1.9vw, 26px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          color: hovered ? 'var(--text-hero)' : 'var(--text-hero-muted)',
          transition: 'color 0.22s ease',
          flex: 1,
          position: 'relative',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {project.hook[lang]}
        </h3>

        {/* Tags */}
        <div className="hidden md:flex items-center gap-2" style={{ flexShrink: 0 }}>
          {project.isLab && (
            <span style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.07em',
              color: 'var(--pulse)',
              padding: '3px 9px',
              borderRadius: '999px',
              border: '1px solid rgba(0,207,186,0.25)',
              background: 'rgba(0,207,186,0.06)',
              whiteSpace: 'nowrap',
            }}>
              LAB
            </span>
          )}
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--tag-text)',
              padding: '3px 9px',
              borderRadius: '999px',
              border: '1px solid var(--tag-border)',
              whiteSpace: 'nowrap',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Industry · Year */}
        <span className="hidden sm:block" style={{
          fontFamily: 'GeistMono, monospace',
          fontSize: '11px',
          fontWeight: 400,
          color: 'var(--text-hero-dim)',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          position: 'relative',
          opacity: 0.6,
        }}>
          {project.industry[lang]} · {project.year}
        </span>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.28 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          style={{
            color: 'var(--project-accent)',
            flexShrink: 0,
            position: 'relative',
            display: 'flex',
          }}
        >
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
