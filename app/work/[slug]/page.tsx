'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import FloatingNav from '@/components/FloatingNav';
import Footer from '@/components/Footer';
import HeroBg from '@/components/HeroBg';
import ImageCarousel from '@/components/ImageCarousel';
import { projects } from '@/content/projects';
import { useLang } from '@/components/LangProvider';

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <span style={{
        fontFamily: 'GeistMono, monospace', fontSize: '10px', fontWeight: 500,
        letterSpacing: '0.14em', color: 'var(--project-accent)', lineHeight: 1,
      }}>{num}</span>
      <div style={{ width: '24px', height: '1px', background: 'var(--project-accent)', opacity: 0.4 }} />
      <span style={{
        fontFamily: 'GeistMono, monospace', fontSize: '10px', fontWeight: 500,
        letterSpacing: '0.12em', color: 'var(--text-hero-dim)', textTransform: 'uppercase', lineHeight: 1,
      }}>{title}</span>
    </div>
  );
}

// ─── Section image ────────────────────────────────────────────────────────────

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        marginTop: '40px',
        position: 'relative',
        aspectRatio: '16/9',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover', objectPosition: 'top' }}
        sizes="(max-width: 1200px) 100vw, 1100px"
      />
    </motion.div>
  );
}

// ─── SECTIONS CONFIG ──────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'overview',     en: 'Overview',                 es: 'Resumen',                num: '01' },
  { id: 'context',      en: 'Context',                  es: 'Contexto',               num: '02' },
  { id: 'my-role',      en: 'My role',                  es: 'Mi rol',                 num: '03' },
  { id: 'interesting',  en: 'What made it interesting', es: 'Qué lo hizo interesante', num: '04' },
  { id: 'approached',   en: 'How I approached it',      es: 'Cómo lo abordé',         num: '05' },
  { id: 'decisions',    en: 'Key decisions',            es: 'Decisiones clave',       num: '06' },
  { id: 'outcome',      en: 'Outcome',                  es: 'Resultado',              num: '07' },
  { id: 'learned',      en: 'What I learned',           es: 'Lo que aprendí',         num: '08' },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkPage({ params }: { params: { slug: string } }) {
  const { lang } = useLang();
  const idx = projects.findIndex(p => p.slug === params.slug);
  if (idx === -1) notFound();

  const project = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  const [activeSection, setActiveSection] = useState(0);
  const [nextHovered, setNextHovered] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Scroll-based stepper — more reliable than IntersectionObserver for variable-height sections
  useEffect(() => {
    const handleScroll = () => {
      const trigger = window.innerHeight * 0.35;
      let active = 0;
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= trigger) {
          active = i;
          break;
        }
      }
      setActiveSection(active);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <FloatingNav />

      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-hero)',
          overflow: 'hidden',
        }}
      >
        <HeroBg />
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1100px',
          margin: '0 auto',
          paddingTop: 'clamp(86px, 11vw, 136px)',
          paddingBottom: 'clamp(60px, 8vw, 96px)',
          paddingLeft: 'clamp(20px, 4vw, 56px)',
          paddingRight: 'clamp(20px, 4vw, 56px)',
        }}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            style={{ marginBottom: '48px' }}
          >
            <Link href="/work" className="link-muted" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: 'GeistMono, monospace', fontSize: '11px', fontWeight: 400,
              letterSpacing: '0.08em',
              color: 'var(--text-hero-dim)', textDecoration: 'none',
            }}>
              <ArrowLeft size={11} strokeWidth={1.5} />
              {lang === 'en' ? 'All projects' : 'Todos los proyectos'}
            </Link>
          </motion.div>

          {/* Number · Industry · Year */}
          <motion.p
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            style={{
              fontFamily: 'GeistMono, monospace', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.10em', color: 'var(--text-hero-dim)',
              textTransform: 'uppercase', marginBottom: '28px',
            }}
          >
            {project.number} · {project.industry[lang]} · {project.year}
          </motion.p>

          {/* Hook — clip-overflow reveal */}
          <div style={{ overflow: 'hidden', marginBottom: '40px' }}>
            <motion.h1
              initial={{ y: '108%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.20 }}
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(32px, 4.5vw, 72px)',
                fontWeight: 900,
                color: 'var(--text-hero)',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              {project.hook[lang]}
            </motion.h1>
          </div>

          {/* Meta pills */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.32 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          >
            {[project.role[lang], project.year, project.confidentiality[lang]].map((m, i) => (
              <span key={i} style={{
                fontFamily: 'GeistMono, monospace', fontSize: '11px', fontWeight: 400,
                letterSpacing: '0.04em', color: 'var(--text-hero-muted)',
                padding: '5px 12px', borderRadius: '999px',
                border: '1px solid var(--tag-border)',
                background: 'var(--hover-row-bg)', whiteSpace: 'nowrap',
              }}>{m}</span>
            ))}
            {project.isLab && (
              <span style={{
                fontFamily: 'GeistMono, monospace', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.07em', color: 'var(--project-accent)',
                padding: '5px 12px', borderRadius: '999px',
                border: '1px solid var(--tag-border)',
                background: 'var(--hover-row-bg)',
              }}>LAB</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── 2. Image Carousel ─────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-hero)' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: `0 clamp(20px,4vw,56px) clamp(40px,6vw,64px)`,
        }}>
          <ImageCarousel images={project.images.hero} alt={project.title[lang]} />
        </div>
      </div>

      {/* ── 3. Metrics Bar ────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-hero-alt)', borderTop: '1px solid var(--stats-divider)' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {project.metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `clamp(24px,4vw,40px) clamp(32px,5vw,64px)`,
                borderRight: i < project.metrics.length - 1
                  ? '1px solid rgba(255,255,255,0.06)'
                  : 'none',
              }}
            >
              <span style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--project-accent)',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
              }}>{m.value}</span>
              <span style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.10em',
                color: 'var(--text-hero-dim)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>{m.label[lang]}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 4. Content Section ────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-hero)' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: `clamp(64px,8vw,96px) clamp(20px,4vw,56px)`,
        }}>
          <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start' }}>

            {/* Sticky Stepper — desktop only */}
            <div className="hidden md:block" style={{
              width: '128px',
              flexShrink: 0,
              position: 'sticky',
              top: '100px',
              height: 'fit-content',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {SECTIONS.map((sec, i) => {
                  const isActive = activeSection === i;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        const el = sectionRefs.current[i];
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="stepper-item"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                        background: 'transparent',
                        border: 'none',
                        borderLeft: isActive ? '2px solid var(--project-accent)' : '2px solid transparent',
                        paddingLeft: '10px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        opacity: isActive ? 1 : 0.30,
                      }}
                    >
                      <span style={{
                        fontFamily: 'GeistMono, monospace',
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        color: isActive ? 'var(--project-accent)' : 'var(--text-hero-dim)',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        fontWeight: isActive ? 500 : 400,
                      }}>{sec.num}</span>
                      <span style={{
                        fontFamily: 'GeistMono, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.06em',
                        color: 'var(--text-hero-dim)',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        fontWeight: isActive ? 500 : 400,
                      }}>{lang === 'en' ? sec.en : sec.es}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Shared paragraph style helper */}
              {/* 01 — Overview */}
              <section id="overview" ref={el => { sectionRefs.current[0] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="01" title={lang === 'en' ? 'Overview' : 'Resumen'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.overview[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* 02 — Context */}
              <section id="context" ref={el => { sectionRefs.current[1] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="02" title={lang === 'en' ? 'Context' : 'Contexto'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.context[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* 03 — My role */}
              <section id="my-role" ref={el => { sectionRefs.current[2] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="03" title={lang === 'en' ? 'My role' : 'Mi rol'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.myRole[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* 04 — What made it interesting */}
              <section id="interesting" ref={el => { sectionRefs.current[3] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="04" title={lang === 'en' ? 'What made it interesting' : 'Qué lo hizo interesante'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.whatMadeItInteresting[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* 05 — How I approached it */}
              <section id="approached" ref={el => { sectionRefs.current[4] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="05" title={lang === 'en' ? 'How I approached it' : 'Cómo lo abordé'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.howIApproached[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                  <SectionImage src={project.images.processMap} alt={lang === 'en' ? 'Process map' : 'Mapa de proceso'} />
                </motion.div>
              </section>

              {/* 06 — Key decisions */}
              <section id="decisions" ref={el => { sectionRefs.current[5] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="06" title={lang === 'en' ? 'Key decisions' : 'Decisiones clave'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.keyDecisions[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                  <SectionImage src={project.images.artifacts} alt={lang === 'en' ? 'Design artifacts' : 'Artefactos de diseño'} />
                </motion.div>
              </section>

              {/* 07 — Outcome */}
              <section id="outcome" ref={el => { sectionRefs.current[6] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="07" title={lang === 'en' ? 'Outcome' : 'Resultado'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.outcome[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>

                  <SectionImage src={project.images.impact} alt={lang === 'en' ? 'Impact' : 'Impacto'} />
                </motion.div>
              </section>

              {/* 08 — What I learned */}
              <section id="learned" ref={el => { sectionRefs.current[7] = el; }} style={{ scrollMarginTop: '80px', paddingBottom: '72px', borderTop: '1px solid var(--stats-divider)', paddingTop: '72px' }}>
                <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }}>
                  <SectionLabel num="08" title={lang === 'en' ? 'What I learned' : 'Lo que aprendí'} />
                  <div style={{ maxWidth: '640px' }}>
                    {project.learned[lang].split('\n\n').map((p, i) => (
                      <p key={i} style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 'clamp(17px, 1.35vw, 19px)', fontWeight: 400, color: 'var(--text-hero-muted)', lineHeight: 1.78, margin: i === 0 ? 0 : '24px 0 0 0' }}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ marginTop: '8px', paddingBottom: '56px', borderTop: '1px solid var(--stats-divider)', paddingTop: '56px' }}
              >
                <p style={{ fontFamily: 'GeistMono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-hero-dim)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>{lang === 'en' ? 'Capabilities' : 'Capacidades'}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'GeistMono, monospace', fontSize: '13px', color: 'var(--text-hero)', padding: '10px 18px', borderRadius: '999px', border: '1px solid var(--tag-border)', background: 'var(--hover-row-bg)' }}>{tag}</span>
                  ))}
                </div>
              </motion.div>

              {/* Project Details Grid */}
              <motion.section
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{
                  marginTop: '72px',
                  padding: '36px',
                  background: 'var(--bg-hero-alt)',
                  borderRadius: '16px',
                  border: '1px solid var(--stats-divider)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '32px',
                }}
              >
                {([
                  [lang === 'en' ? 'Project'  : 'Proyecto',  project.title[lang]],
                  [lang === 'en' ? 'Industry' : 'Industria', project.industry[lang]],
                  [lang === 'en' ? 'Year'     : 'Año',        project.year],
                  [lang === 'en' ? 'Role'     : 'Rol',        project.role[lang]],
                  [lang === 'en' ? 'Status'   : 'Estado',     project.confidentiality[lang]],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <p style={{
                      fontFamily: 'GeistMono, monospace',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.10em',
                      color: 'var(--text-hero-dim)',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      margin: '0 0 8px 0',
                    }}>{label}</p>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--text-hero)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.4,
                      margin: 0,
                    }}>{value}</p>
                  </div>
                ))}
              </motion.section>

            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Next Project ───────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-hero)', borderTop: '1px solid var(--stats-divider)', overflow: 'hidden' }}>
        <Link
          href={`/work/${next.slug}`}
          onMouseEnter={() => setNextHovered(true)}
          onMouseLeave={() => setNextHovered(false)}
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: `clamp(56px,8vw,96px) clamp(20px,4vw,56px) clamp(48px,7vw,80px)`,
          }}>

            {/* Label */}
            <p style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: nextHovered ? 'var(--project-accent)' : 'var(--text-hero-dim)',
              textTransform: 'uppercase',
              margin: '0 0 32px 0',
              transition: 'color 0.3s ease',
            }}>{lang === 'en' ? 'Next project' : 'Siguiente proyecto'}</p>

            {/* Main row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <div>
                {/* Meta — slides up on hover */}
                <motion.p
                  animate={{ opacity: nextHovered ? 1 : 0, y: nextHovered ? 0 : 8 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  style={{
                    fontFamily: 'GeistMono, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.10em',
                    color: 'var(--text-hero-dim)',
                    textTransform: 'uppercase',
                    margin: '0 0 14px 0',
                  }}
                >
                  {next.number}&nbsp;·&nbsp;{next.industry[lang]}&nbsp;·&nbsp;{next.year}
                </motion.p>

                {/* Hook title */}
                <h3 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(24px, 3.5vw, 52px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: nextHovered ? 'var(--project-accent)' : 'var(--text-hero)',
                  opacity: nextHovered ? 1 : 0.52,
                  maxWidth: '680px',
                  margin: 0,
                  transition: 'color 0.3s ease, opacity 0.3s ease',
                }}>{next.hook[lang]}</h3>
              </div>

              {/* Arrow */}
              <motion.div
                animate={{ x: nextHovered ? 8 : 0, y: nextHovered ? -8 : 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{
                  flexShrink: 0,
                  color: nextHovered ? 'var(--project-accent)' : 'var(--text-hero-dim)',
                  transition: 'color 0.3s ease',
                }}
              >
                <ArrowUpRight size={40} strokeWidth={1} />
              </motion.div>
            </div>

            {/* Accent underline — fills on hover */}
            <motion.div
              animate={{ scaleX: nextHovered ? 1 : 0 }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                height: '1px',
                background: 'var(--project-accent)',
                transformOrigin: 'left center',
                marginTop: '40px',
              }}
            />
          </div>
        </Link>
      </div>

      {/* ── 6. Footer ─────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
