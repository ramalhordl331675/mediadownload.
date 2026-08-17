import { LANGS, getLang, setLang, t } from '../services/i18n';

/** Botão de idioma + menu suspenso. Inserido no header (desktop e mobile). */
export function langSwitcherTemplate(): string {
  return `
    <div class="lang-wrap" id="lang-wrap">
      <button
        class="btn btn-ghost lang-toggle"
        id="lang-toggle"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        data-i18n-aria="header.lang"
        title="Idioma / Language"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>
        <span class="lang-current" id="lang-current">${getLang().toUpperCase()}</span>
        <svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="lang-menu" id="lang-menu" role="listbox" aria-label="${t('header.lang')}">
        ${LANGS.map(
          (l) => `
          <button
            class="lang-option"
            type="button"
            role="option"
            data-lang="${l.code}"
            aria-selected="${getLang() === l.code ? 'true' : 'false'}"
          >
            <span class="lang-name">${l.name}</span>
            <span class="lang-code">${l.label}</span>
          </button>`,
        ).join('')}
      </div>
    </div>
  `;
}

export function initLangSwitcher(container: HTMLElement): void {
  const toggle = container.querySelector<HTMLButtonElement>('#lang-toggle');
  const menu = container.querySelector<HTMLElement>('#lang-menu');
  const current = container.querySelector<HTMLElement>('#lang-current');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean): void => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  const refresh = (): void => {
    const lang = getLang();
    if (current) current.textContent = lang.toUpperCase();
    menu.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((opt) => {
      opt.setAttribute('aria-selected', String(opt.dataset.lang === lang));
    });
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = opt.dataset.lang;
      if (code === 'pt' || code === 'en' || code === 'es') {
        setLang(code);
      }
      setOpen(false);
      refresh();
    });
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Atualiza o botão quando o idioma muda de qualquer lugar da página.
  document.addEventListener('lang-changed', refresh);
}