import './styles/main.css';

import { initTheme } from './components/theme';
import { initHeader } from './components/header';
import { footerTemplate, initFooter } from './components/sections';
import { initCookies } from './components/cookieBanner';
import { initAds } from './components/adSlot';
import { initScripts } from './components/scripts';

export interface Shell {
  app: HTMLElement;
}

/**
 * Monta a estrutura comum de toda página (header, main, footer, cookies)
 * e inicializa os comportamentos globais. O conteúdo do <main> é passado
 * como HTML (sempre originado em templates estáticos deste projeto).
 */
export function mountShell(mainHtml: string): Shell {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) {
    throw new Error('Ponto de montagem #app não encontrado');
  }

  const toggleTheme = initTheme();

  app.innerHTML = `
    <div id="header-mount"></div>
    <main id="main">${mainHtml}</main>
    <div id="footer-mount">${footerTemplate()}</div>
  `;

  const headerMount = app.querySelector<HTMLElement>('#header-mount');
  if (headerMount) {
    initHeader(headerMount, {
      onToggleTheme: toggleTheme,
      onMenuToggle: (open) => {
        document.body.style.overflow = open ? 'hidden' : '';
      },
    });
  }

  initFooter(app);
  initAds(app);
  void initScripts();
  const cookieRoot = document.querySelector<HTMLElement>('#cookie-root');
  if (cookieRoot) {
    initCookies(cookieRoot);
  }
  initSmoothScroll(app);

  return { app };
}

function initSmoothScroll(root: HTMLElement): void {
  root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = root.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });
}