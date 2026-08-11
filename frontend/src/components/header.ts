import { escapeHtml } from '../utils/html';
import { brandMarkHtml, brandWordmarkHtml } from './brand';

export interface HeaderOptions {
  onToggleTheme: () => void;
  onMenuToggle: (open: boolean) => void;
}

export function headerTemplate(): string {
  return `
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <a class="brand" href="./" aria-label="MediaSnap — Início">
          ${brandMarkHtml()}
          ${brandWordmarkHtml()}
        </a>

        <nav class="nav" aria-label="Navegação principal">
          <ul class="nav-list">
            <li><a class="nav-link" href="./">Início</a></li>
            <li><a class="nav-link" href="./como-funciona.html">Como funciona</a></li>
            <li><a class="nav-link" href="./plataformas.html">Plataformas</a></li>
            <li><a class="nav-link" href="./faq.html">FAQ</a></li>
            <li><a class="nav-link" href="./sobre.html">Sobre</a></li>
            <li><a class="nav-link" href="./contato.html">Contato</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <button class="btn btn-ghost theme-toggle" type="button" id="theme-toggle" aria-label="Alternar tema claro e escuro" title="Alternar tema">
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          </button>
          <a class="btn btn-primary" href="#url-form">Começar agora</a>
          <button class="btn btn-ghost menu-toggle" type="button" id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <nav class="mobile-nav" id="mobile-nav" aria-label="Navegação móvel">
        ${['./', './como-funciona.html', './plataformas.html', './faq.html', './sobre.html', './contato.html']
          .map((href, i) => {
            const labels = ['Início', 'Como funciona', 'Plataformas', 'FAQ', 'Sobre', 'Contato'];
            return `<a href="${href}" data-menu-link>${escapeHtml(labels[i])}</a>`;
          })
          .join('')}
      </nav>
    </header>

    <div id="top"></div>
  `;
}

export function initHeader(container: HTMLElement, options: HeaderOptions): void {
  container.innerHTML = headerTemplate();

  const header = container.querySelector<HTMLElement>('#site-header');
  const toggleBtn = container.querySelector<HTMLButtonElement>('#theme-toggle');
  const menuBtn = container.querySelector<HTMLButtonElement>('#menu-toggle');
  const mobileNav = container.querySelector<HTMLElement>('#mobile-nav');
  const links = container.querySelectorAll<HTMLAnchorElement>('[data-menu-link]');

  const onScroll = (): void => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggleBtn?.addEventListener('click', options.onToggleTheme);

  const setMenu = (open: boolean): void => {
    mobileNav?.classList.toggle('is-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
  };

  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    options.onMenuToggle(open);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMenu(false);
    }
  });
}