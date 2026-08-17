import './styles/main.css';

import { initTheme } from './components/theme';
import { initHeader } from './components/header';
import { footerTemplate, initFooter } from './components/sections';
import { initCookies } from './components/cookieBanner';
import { initAds } from './components/adSlot';
import { initScripts } from './components/scripts';
import { applyTranslations, LANG_EVENT } from './services/i18n';

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
    <main id="main" tabindex="-1">${mainHtml}</main>
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
  applyTranslations(app);
  initSmoothScroll();

  // Quando o idioma muda, re-traduz a página inteira sem recarregar.
  document.addEventListener(LANG_EVENT, () => {
    applyTranslations(document.body);
  });

  return { app };
}

function initSmoothScroll(): void {
  // Vincula no documento inteiro (inclui o "Pular para o conteúdo", que fica
  // fora de #app). A navegação nativa por âncora pode falhar com overflow-x:
  // clip no body; por isso o scroll é feito via JS com o offset do header fixo.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', id);
      // Skip link: move o foco para o conteúdo, não apenas a rolagem.
      if (anchor.classList.contains('skip-link')) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}