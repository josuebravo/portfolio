'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Home } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useLang } from '@/components/LangProvider';

// ─── Tokens ───────────────────────────────────────────────────────────────────

const DARK = {
  bg:         'rgba(10, 6, 28, 0.60)',
  bgScrolled: 'rgba(10, 6, 28, 0.82)',
  shadow:     '0 8px 40px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.09)',
  border:     '1px solid rgba(255,255,255,0.10)',
  textOn:     '#EEEEEC',
  textOff:    'rgba(238,238,236,0.36)',
  pillBg:     'rgba(255,255,255,0.09)',
  pillBorder: 'rgba(255,255,255,0.10)',
  divider:    'rgba(255,255,255,0.07)',
};

const LIGHT = {
  bg:         'rgba(255,255,255,0.55)',
  bgScrolled: 'rgba(255,255,255,0.80)',
  shadow:     '0 8px 40px rgba(20,18,42,0.08), inset 0 1px 0 rgba(255,255,255,1.0)',
  border:     '1px solid rgba(20,18,42,0.06)',
  textOn:     '#14122A',
  textOff:    'rgba(20,18,42,0.36)',
  pillBg:     'rgba(20,18,42,0.06)',
  pillBorder: 'rgba(20,18,42,0.08)',
  divider:    'rgba(20,18,42,0.07)',
};

type T = typeof DARK;

const PILL_SPRING = { type: 'spring' as const, stiffness: 360, damping: 28, mass: 0.8 };

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({ href, label, active, t }: {
  href: string; label: string; active: boolean; t: T;
}) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 34,
        padding: '0 14px',
        borderRadius: 17,
        textDecoration: 'none',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 17,
            background: t.pillBg,
            border: `1px solid ${t.pillBorder}`,
          }}
          transition={PILL_SPRING}
        />
      )}
      <span style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'Geist, system-ui, sans-serif',
        fontSize: '13px',
        fontWeight: active ? 500 : 400,
        letterSpacing: '0.01em',
        color: active ? t.textOn : t.textOff,
        transition: 'color 0.22s ease',
      }}>
        {label}
      </span>
    </Link>
  );
}

// ─── LangBtn ─────────────────────────────────────────────────────────────────

function LangBtn({ code, active, onClick, t }: {
  code: string; active: boolean; onClick: () => void; t: T;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        width: 36,
        borderRadius: 14,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {active && (
        <motion.span
          layoutId="lang-pill"
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 14,
            background: t.pillBg,
            border: `1px solid ${t.pillBorder}`,
          }}
          transition={{ type: 'spring', stiffness: 440, damping: 30, mass: 0.7 }}
        />
      )}
      <span style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'GeistMono, monospace',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.07em',
        color: active ? t.textOn : t.textOff,
        transition: 'color 0.22s ease',
      }}>
        {code}
      </span>
    </button>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Sep({ color }: { color: string }) {
  return (
    <div style={{
      width: 1, height: 16, background: color,
      flexShrink: 0, margin: '0 4px',
    }} />
  );
}

// ─── ThemeBtn ────────────────────────────────────────────────────────────────

function ThemeBtn({ isDark, toggle, t }: { isDark: boolean; toggle: () => void; t: T }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 34,
        width: 36,
        borderRadius: 17,
        border: 'none',
        background: hovered ? t.pillBg : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.22s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -30, scale: 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.75 }}
          transition={{ duration: 0.16 }}
          style={{ display: 'flex', color: hovered ? t.textOn : t.textOff }}
        >
          {isDark
            ? <Moon size={14} strokeWidth={1.6} />
            : <Sun size={14} strokeWidth={1.6} />
          }
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

// ─── FloatingNav ─────────────────────────────────────────────────────────────

export default function FloatingNav() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';
  const t = isDark ? DARK : LIGHT;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navItems = [
    { href: '/work',  label: lang === 'en' ? 'Projects' : 'Proyectos' },
    { href: '/about', label: lang === 'en' ? 'About'    : 'Sobre mí'  },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 1 }}
          aria-label="Main navigation"
          style={{
            position: 'fixed',
            zIndex: 50,
            top: 16,
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 6px',
            borderRadius: 999,
            background: scrolled ? t.bgScrolled : t.bg,
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            boxShadow: t.shadow,
            border: t.border,
            gap: 0,
            transition: 'background 0.35s ease',
          }}
          className="max-md:!top-auto max-md:!bottom-4"
        >
          {/* Home — house icon */}
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 34, width: 38, borderRadius: 17,
              textDecoration: 'none', flexShrink: 0,
              background: isActive('/') ? t.pillBg : 'transparent',
              border: `1px solid ${isActive('/') ? t.pillBorder : 'transparent'}`,
              transition: 'background 0.22s ease, border-color 0.22s ease',
              color: isActive('/') ? t.textOn : t.textOff,
            }}
          >
            <Home size={14} strokeWidth={1.8} />
          </Link>

          <Sep color={t.divider} />

          {/* Nav links */}
          {navItems.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActive(item.href)}
              t={t}
            />
          ))}

          <Sep color={t.divider} />

          {/* Language */}
          <LangBtn code="EN" active={lang === 'en'} onClick={() => lang !== 'en' && toggleLang()} t={t} />
          <LangBtn code="ES" active={lang === 'es'} onClick={() => lang !== 'es' && toggleLang()} t={t} />

          <Sep color={t.divider} />

          {/* Theme */}
          <ThemeBtn isDark={isDark} toggle={toggleTheme} t={t} />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
