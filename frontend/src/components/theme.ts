const THEME_KEY = 'theme';

export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function initTheme(): () => void {
  applyTheme(getInitialTheme());

  const toggle = (): void => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  return toggle;
}