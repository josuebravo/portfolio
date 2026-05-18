'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin, Download, MapPin } from 'lucide-react';
import FloatingNav from '@/components/FloatingNav';
import HeroBg from '@/components/HeroBg';
import Footer from '@/components/Footer';
import { useLang } from '@/components/LangProvider';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: EASE, delay: d },
  }),
};

// ─── Data ────────────────────────────────────────────────────────────────────

const EXPERIENCE = {
  en: [
    {
      period: '2023–Present',
      role: 'AI-assisted Product Design Lead · UX/UI & Interaction Design',
      org: 'EY Studio+ — Insurance enterprise, AI quoting product',
      note: 'NDA',
    },
    {
      period: '2021–2023',
      role: 'Design System Lead · UX/UI',
      org: 'Totalplay — Telecom & entertainment conglomerate',
      note: 'Public',
    },
    {
      period: '2022–2023',
      role: 'UX/UI Tutor',
      org: 'Coderhouse — Advanced UX/UI program',
      note: 'Education',
    },
    {
      period: '2020–2021',
      role: 'Industrial & UX Designer',
      org: 'Somatres — Industrial design studio',
      note: 'Studio',
    },
  ],
  es: [
    {
      period: '2023–Presente',
      role: 'Lead de Diseño de Producto con IA · UX/UI & Diseño de Interacción',
      org: 'EY Studio+ — Enterprise de seguros, producto de cotización con IA',
      note: 'NDA',
    },
    {
      period: '2021–2023',
      role: 'Lead Design System · UX/UI',
      org: 'Totalplay — Conglomerado de telecom & entretenimiento',
      note: 'Público',
    },
    {
      period: '2022–2023',
      role: 'Tutor UX/UI',
      org: 'Coderhouse — Programa avanzado de UX/UI',
      note: 'Educación',
    },
    {
      period: '2020–2021',
      role: 'Diseñador Industrial & UX',
      org: 'Somatres — Estudio de diseño industrial',
      note: 'Estudio',
    },
  ],
};

const CERTIFICATIONS = {
  en: [
    { title: 'AI in Microsoft Azure', org: 'Microsoft', year: '2024' },
    { title: 'EF SET C1 English (65/100)', org: 'EF Education', year: '2023' },
    { title: 'Behavioral Economics', org: 'Interaction Design Foundation', year: '2022' },
    { title: 'Designing AI Assistants', org: 'IxDF', year: '2024' },
  ],
  es: [
    { title: 'IA en Microsoft Azure', org: 'Microsoft', year: '2024' },
    { title: 'EF SET C1 Inglés (65/100)', org: 'EF Education', year: '2023' },
    { title: 'Economía del Comportamiento', org: 'Interaction Design Foundation', year: '2022' },
    { title: 'Diseño de Asistentes de IA', org: 'IxDF', year: '2024' },
  ],
};

const EDUCATION = {
  en: [
    { degree: 'Advanced UX/UI Design', school: 'Coderhouse', year: '2021' },
    { degree: 'B.S. Industrial Design', school: 'Universidad Autónoma Metropolitana (UAM)', year: '2010–2015' },
  ],
  es: [
    { degree: 'Diseño UX/UI Avanzado', school: 'Coderhouse', year: '2021' },
    { degree: 'Lic. Diseño Industrial', school: 'Universidad Autónoma Metropolitana (UAM)', year: '2010–2015' },
  ],
};

const CAPABILITIES = [
  'Enterprise UX', 'AI Interface Design', 'Design Systems',
  'User Research', 'Behavioral Design & CRO', 'Interaction Architecture',
  'Design Strategy', 'DesignOps', 'Prototyping',
];

const PRINCIPLES = {
  en: [
    {
      n: '01',
      title: 'I design from evidence, not assumptions.',
      body: 'Before designing an interface, I work to understand what problem is worth solving. Research, data, business context, real usage signals. Decisions need a foundation, not just visual intuition.',
    },
    {
      n: '02',
      title: 'I think in systems, not isolated screens.',
      body: 'I design experiences that can grow, adapt, and stay coherent across channels, teams, and business moments. A good interface does not just solve a screen. It creates structure that scales.',
    },
    {
      n: '03',
      title: 'Technology accelerates. Judgment directs.',
      body: 'I use AI, prototypes, and digital tools to explore faster and open possibilities, but I do not delegate the design decision. The value is in knowing what to adjust, what to simplify, and what to turn into a clear and trustworthy experience.',
    },
  ],
  es: [
    {
      n: '01',
      title: 'Diseño desde evidencia, no desde supuestos.',
      body: 'Antes de diseñar una interfaz, busco entender qué problema vale la pena resolver. Combino investigación, datos, contexto de negocio y señales reales de uso para tomar decisiones con fundamento, no solo con intuición visual.',
    },
    {
      n: '02',
      title: 'Pienso en sistemas, no en pantallas aisladas.',
      body: 'Diseño experiencias que puedan crecer, adaptarse y mantenerse coherentes en distintos canales, equipos y momentos del negocio. Una buena interfaz no solo resuelve una pantalla: crea estructura para escalar mejor.',
    },
    {
      n: '03',
      title: 'La tecnología acelera, pero el criterio dirige.',
      body: 'Uso IA, prototipos y herramientas digitales para explorar más rápido y abrir posibilidades, pero no delego la decisión de diseño. El valor está en saber qué ajustar, qué simplificar y qué convertir en una experiencia clara, usable y confiable.',
    },
  ],
};

// ─── Avatar with parallax ─────────────────────────────────────────────────────

function ParallaxAvatar() {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '800px', display: 'flex', justifyContent: 'center' }}
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.15 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          aspectRatio: '4/5',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid var(--tag-border)',
        }}
      >
        <Image
          src="/images/avatar.webp"
          alt="Josue Bravo — Product Designer"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          priority
          sizes="(max-width: 768px) 90vw, 420px"
        />

        {/* Glare overlay */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Bottom gradient for name badge */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Location badge */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: 'GeistMono, monospace',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.85)',
          padding: '5px 10px',
          borderRadius: '999px',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <MapPin size={11} strokeWidth={1.8} />
          Mexico City
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function About() {
  const { lang } = useLang();
  const exp = EXPERIENCE[lang];
  const principles = PRINCIPLES[lang];
  const certs = CERTIFICATIONS[lang];
  const edu = EDUCATION[lang];

  const cvHref = lang === 'en' ? '/cv/josue-bravo-cv-en.pdf' : '/cv/josue-bravo-cv-es.pdf';

  const noteColor = (note: string) => {
    if (note === 'NDA') return 'var(--text-hero-dim)';
    if (note === 'Lab' || note === 'Estudio' || note === 'Studio') return 'var(--project-accent)';
    return 'var(--text-hero-dim)';
  };

  const noteBg = (note: string) => {
    if (note === 'Lab' || note === 'Estudio' || note === 'Studio') return 'var(--hover-row-bg)';
    return 'transparent';
  };

  return (
    <>
      <FloatingNav />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', background: 'var(--bg-hero)', overflow: 'hidden' }}>
        <HeroBg />

        <div
          className="relative z-10 max-w-content mx-auto px-6 pt-[136px] pb-24"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr)',
            gap: '56px',
            alignItems: 'center',
          }}
        >
          {/* Two-column on large screens */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '56px',
            alignItems: 'center',
          }}
            className="lg:!grid-cols-[420px_1fr]"
          >
            {/* Left — avatar */}
            <ParallaxAvatar />

            {/* Right — text */}
            <div>
              <motion.p
                custom={0.1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  fontFamily: 'GeistMono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.11em',
                  color: 'var(--text-hero-dim)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                {lang === 'en' ? 'ABOUT' : 'SOBRE MÍ'}
              </motion.p>

              <motion.h1
                custom={0.2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(36px, 5vw, 68px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  color: 'var(--text-hero)',
                  marginBottom: '20px',
                }}
              >
                Josue Bravo<span style={{ color: 'var(--project-accent)' }}>.</span>
              </motion.h1>

              <motion.p
                custom={0.32}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  fontFamily: 'Geist, system-ui, sans-serif',
                  fontSize: 'clamp(15px, 1.3vw, 18px)',
                  fontWeight: 400,
                  color: 'var(--text-hero-muted)',
                  lineHeight: 1.75,
                  maxWidth: '520px',
                  marginBottom: '32px',
                }}
              >
                {lang === 'en'
                  ? 'I design enterprise digital products where strategy, systems, and human behavior intersect. My practice spans the full design arc — from early discovery through to delivery and measurement — across Mexico, Latin America, and the US.'
                  : 'Diseño productos digitales enterprise donde la estrategia, los sistemas y el comportamiento humano se intersectan. Mi práctica abarca todo el arco del diseño — desde el discovery temprano hasta la entrega y medición — en México, Latinoamérica y Estados Unidos.'}
              </motion.p>

              {/* ── CTAs ── */}
              <motion.div
                custom={0.44}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}
              >
                {/* Download CV */}
                <a
                  href={cvHref}
                  download
                  className="btn-accent"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '11px 22px',
                    borderRadius: '999px',
                    background: 'var(--project-accent)',
                    color: 'var(--bg-hero)',
                    fontFamily: 'Geist, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  <Download size={14} strokeWidth={2} />
                  {lang === 'en' ? 'Download CV' : 'Descargar CV'}
                </a>

                {/* Email */}
                <a
                  href="mailto:josuebravodi@gmail.com"
                  className="btn-outlined"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '11px 20px',
                    borderRadius: '999px',
                    border: '1px solid var(--tag-border)',
                    background: 'var(--hover-row-bg)',
                    color: 'var(--text-hero-muted)',
                    fontFamily: 'Geist, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={14} strokeWidth={1.6} />
                  josuebravodi@gmail.com
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/josuebravodi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outlined"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '11px 20px',
                    borderRadius: '999px',
                    border: '1px solid var(--tag-border)',
                    background: 'var(--hover-row-bg)',
                    color: 'var(--text-hero-muted)',
                    fontFamily: 'Geist, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  <Linkedin size={14} strokeWidth={1.6} />
                  LinkedIn
                </a>
              </motion.div>

              {/* ── Languages ── */}
              <motion.div
                custom={0.52}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
              >
                {[
                  { lang: 'Spanish', level: lang === 'en' ? 'Native' : 'Nativo' },
                  { lang: 'English', level: lang === 'en' ? 'C1 Professional' : 'C1 Profesional' },
                  { lang: 'Portuguese', level: lang === 'en' ? 'Elementary' : 'Elemental' },
                ].map(item => (
                  <div key={item.lang}>
                    <span style={{
                      fontFamily: 'GeistMono, monospace',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.09em',
                      color: 'var(--text-hero-dim)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '2px',
                    }}>
                      {item.lang}
                    </span>
                    <span style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: 'var(--text-hero-muted)',
                    }}>
                      {item.level}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-content mx-auto px-6 py-24">

          {/* ── HOW I WORK ─────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: '80px' }}
          >
            <p style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.11em',
              color: 'var(--text-hero-dim)',
              textTransform: 'uppercase',
              marginBottom: '36px',
            }}>
              {lang === 'en' ? 'HOW I WORK' : 'CÓMO TRABAJO'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
              {principles.map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  style={{
                    padding: '28px',
                    background: 'var(--hover-row-bg)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{
                    fontFamily: 'GeistMono, monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--project-accent)',
                    display: 'block',
                    marginBottom: '12px',
                  }}>
                    {p.n}
                  </span>
                  <h3 style={{
                    fontFamily: 'Geist, system-ui, sans-serif',
                    fontSize: '17px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-hero)',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    fontFamily: 'Geist, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'var(--text-hero-muted)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {p.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── EXPERIENCE ─────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: '80px' }}
          >
            <p style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.11em',
              color: 'var(--text-hero-dim)',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              {lang === 'en' ? 'SELECTED EXPERIENCE' : 'EXPERIENCIA SELECCIONADA'}
            </p>

            <div style={{ marginTop: '28px' }}>
              {exp.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                  style={{
                    borderTop: '1px solid var(--stats-divider)',
                    padding: '22px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{
                    fontFamily: 'GeistMono, monospace',
                    fontSize: '11px',
                    fontWeight: 400,
                    color: 'var(--text-hero-dim)',
                    minWidth: '88px',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}>
                    {item.period}
                  </span>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--text-hero)',
                      letterSpacing: '-0.01em',
                      margin: '0 0 4px',
                    }}>
                      {item.role}
                    </p>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'var(--text-hero-muted)',
                      margin: 0,
                    }}>
                      {item.org}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: 'GeistMono, monospace',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    color: noteColor(item.note),
                    padding: '3px 9px',
                    borderRadius: '999px',
                    border: '1px solid var(--tag-border)',
                    background: noteBg(item.note),
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                    marginTop: '2px',
                  }}>
                    {item.note}
                  </span>
                </motion.div>
              ))}
              <div style={{ borderTop: '1px solid var(--stats-divider)' }} />
            </div>
          </motion.section>

          {/* ── EDUCATION + CERTIFICATIONS ─────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              marginBottom: '80px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Education */}
            <div>
              <p style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.11em',
                color: 'var(--text-hero-dim)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                {lang === 'en' ? 'EDUCATION' : 'EDUCACIÓN'}
              </p>
              {edu.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  style={{
                    borderTop: '1px solid var(--stats-divider)',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--text-hero)',
                      letterSpacing: '-0.01em',
                      margin: '0 0 3px',
                    }}>
                      {item.degree}
                    </p>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: 'var(--text-hero-muted)',
                      margin: 0,
                    }}>
                      {item.school}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: 'GeistMono, monospace',
                    fontSize: '11px',
                    color: 'var(--text-hero-dim)',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}>
                    {item.year}
                  </span>
                </motion.div>
              ))}
              <div style={{ borderTop: '1px solid var(--stats-divider)' }} />
            </div>

            {/* Certifications */}
            <div>
              <p style={{
                fontFamily: 'GeistMono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.11em',
                color: 'var(--text-hero-dim)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                {lang === 'en' ? 'CERTIFICATIONS' : 'CERTIFICACIONES'}
              </p>
              {certs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  style={{
                    borderTop: '1px solid var(--stats-divider)',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--text-hero)',
                      letterSpacing: '-0.01em',
                      margin: '0 0 3px',
                    }}>
                      {item.title}
                    </p>
                    <p style={{
                      fontFamily: 'Geist, system-ui, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: 'var(--text-hero-muted)',
                      margin: 0,
                    }}>
                      {item.org}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: 'GeistMono, monospace',
                    fontSize: '11px',
                    color: 'var(--text-hero-dim)',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}>
                    {item.year}
                  </span>
                </motion.div>
              ))}
              <div style={{ borderTop: '1px solid var(--stats-divider)' }} />
            </div>
          </motion.section>

          {/* ── CAPABILITIES ───────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: '80px' }}
          >
            <p style={{
              fontFamily: 'GeistMono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.11em',
              color: 'var(--text-hero-dim)',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}>
              {lang === 'en' ? 'CAPABILITIES' : 'CAPACIDADES'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CAPABILITIES.map(cap => (
                <span key={cap} style={{
                  fontFamily: 'GeistMono, monospace',
                  fontSize: '12px',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  color: 'var(--text-hero-muted)',
                  padding: '7px 16px',
                  borderRadius: '999px',
                  border: '1px solid var(--tag-border)',
                  background: 'var(--hover-row-bg)',
                }}>
                  {cap}
                </span>
              ))}
            </div>
          </motion.section>

          {/* ── CTA ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              padding: '40px',
              background: 'var(--hover-row-bg)',
              borderRadius: '16px',
              border: '1px solid var(--tag-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <p style={{
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text-hero)',
                marginBottom: '6px',
              }}>
                {lang === 'en' ? 'Have a project in mind?' : '¿Tienes un proyecto en mente?'}
              </p>
              <p style={{
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--text-hero-muted)',
                margin: 0,
              }}>
                {lang === 'en' ? "I'm available for new engagements." : 'Estoy disponible para nuevos proyectos.'}
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-accent"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'var(--project-accent)',
                color: 'var(--bg-hero)',
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              {lang === 'en' ? "Let's talk" : 'Hablemos'}
              <span style={{ fontSize: '16px' }}>→</span>
            </Link>
          </motion.div>

        </div>
      </div>

      <Footer />
    </>
  );
}
