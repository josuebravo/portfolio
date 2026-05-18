'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggle: () => {} });

// Detect theme from system preference, with time-of-day fallback (no system API)
function detectTheme(): Theme {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  // Tracks whether the current theme was chosen manually (persisted) vs auto-detected
  const isManual = useRef(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      isManual.current = true;
      setTheme(stored);
    } else {
      setTheme(detectTheme());
    }

    // Follow system preference changes — only when user has not manually overridden
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (!isManual.current) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onSystemChange);
    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    // Only persist if the user made a manual choice
    if (isManual.current) localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggle = () => {
    isManual.current = true;
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
