import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Humano v3 Core
        'field-light': '#EEEEEC',
        'field-dark': '#0C072A',
        'indigo': '#200392',
        'indigo-mid': '#180C50',
        'pulse': '#00CFBA',
        'ink': '#14122A',
        // Text
        'dust-light': '#A09EAA',
        'dust-mid': '#655F82',
        'dust-dark': '#504C64',
        'gray-meta': '#757575',
        // Accents
        'footer-accent': '#60E4FC',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        geist: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['GeistMono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(96px, 13.5vw, 194px)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'headline': ['clamp(36px, 4.4vw, 64px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'subhead': ['clamp(18px, 1.7vw, 24px)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'label': ['13.2px', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        'content': '943px',
      },
      borderRadius: {
        'card': '24px',
        'btn': '20px',
        'nav': '24px',
        'tag': '999px',
      },
      backgroundImage: {
        'highlight': 'linear-gradient(to right, rgba(4,158,226,0.15), rgba(4,158,226,0.05))',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 1s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.6s ease forwards',
        'slide-up': 'slide-up 1s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
