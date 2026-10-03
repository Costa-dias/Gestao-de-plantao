import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'escalafacil-theme';
const EVENT_NAME = 'escalafacil-theme-change';

export function getStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark') return value;
  } catch {
    // armazenamento indisponível: usa o tema do aparelho
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.remove('light');
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#020617' : '#f8fafc');
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // sem armazenamento: vale só até recarregar
  }
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    const onChange = () => setThemeState(getStoredTheme());
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme(getStoredTheme() === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, setTheme, toggle };
}

if (typeof document !== 'undefined') {
  applyTheme(getStoredTheme());
}
