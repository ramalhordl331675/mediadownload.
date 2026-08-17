import { escapeHtml } from '../utils/html';
import { type ConsentPrefs, hasConsent, readConsent, saveConsent } from '../services/consent';
import { applyTranslations } from '../services/i18n';

function bannerTemplate(): string {
  return `
    <div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Consentimento de cookies">
      <h3 data-i18n="cookies.title">Nós utilizamos cookies</h3>
      <p data-i18n="cookies.desc">Utilizamos cookies necessários para funcionamento e, quando autorizado, cookies de análise e publicidade para melhorar sua experiência.</p>
      <div class="cookie-actions">
        <button class="btn btn-primary" type="button" data-cookie="accept"><span class="btn-accept-all" data-i18n="cookies.accept">Aceitar</span></button>
        <button class="btn btn-ghost" type="button" data-cookie="reject" data-i18n="cookies.reject">Recusar</button>
        <button class="btn btn-minimal" type="button" data-cookie="config" data-i18n="cookies.config">Configurar</button>
      </div>
    </div>
  `;
}

function preferencesModalTemplate(current: ConsentPrefs): string {
  const buildSwitch = (id: string, label: string, labelKey: string, checked: boolean, disabled = false): string => `
    <div class="cookie-pref">
      <div>
        <strong data-i18n="${labelKey}">${escapeHtml(label)}</strong>
        <span data-i18n="${id === 'necessary' ? 'cookies.modal.necessaryDesc' : ''}">${id === 'necessary' ? 'Necessário para o funcionamento do site.' : ''}</span>
      </div>
      <label class="switch">
        <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} />
        <span class="slider" aria-hidden="true"></span>
      </label>
    </div>
  `;

  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
        <h3 id="cookie-modal-title" data-i18n="cookies.modal.title">Preferências de cookies</h3>
        <p data-i18n="cookies.modal.desc">Escolha quais cookies você autoriza. Os essenciais não podem ser desativados.</p>
        ${buildSwitch('necessary', 'Essenciais', 'cookies.modal.necessary', true, true)}
        ${buildSwitch('analytics', 'Analíticos', 'cookies.modal.analytics', current.analytics)}
        ${buildSwitch('advertising', 'Publicidade', 'cookies.modal.advertising', current.advertising)}
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" data-cookie-cancel data-i18n="cookies.modal.cancel">Cancelar</button>
          <button class="btn btn-primary" type="button" data-cookie-save data-i18n="cookies.modal.save">Salvar preferências</button>
        </div>
      </div>
    </div>
  `;
}

export function initCookies(mount: HTMLElement): void {
  let banner: HTMLElement | null = null;

  const closeBanner = (): void => {
    banner?.remove();
  };

  const openModal = (): void => {
    const current = readConsent();
    const backdrop = document.createElement('div');
    backdrop.innerHTML = preferencesModalTemplate(current);
    mount.appendChild(backdrop);
    applyTranslations(backdrop);

    const cancel = backdrop.querySelector<HTMLButtonElement>('[data-cookie-cancel]');
    const save = backdrop.querySelector<HTMLButtonElement>('[data-cookie-save]');
    const backdropEl = backdrop.querySelector<HTMLElement>('[data-modal-backdrop]');

    const saveFn = (): void => {
      const analytics = backdrop.querySelector<HTMLInputElement>('#analytics')?.checked ?? false;
      const advertising = backdrop.querySelector<HTMLInputElement>('#advertising')?.checked ?? false;
      saveConsent({ necessary: true, analytics, advertising });
      backdrop.remove();
      closeBanner();
    };

    cancel?.addEventListener('click', () => backdrop.remove());
    save?.addEventListener('click', saveFn);
    backdropEl?.addEventListener('click', (e) => {
      if (e.target === backdropEl) backdrop.remove();
    });

    const firstFocusable = backdrop.querySelector<HTMLButtonElement>('[data-cookie-cancel]');
    firstFocusable?.focus();
  };

  // Permite abrir as preferências a partir de qualquer página (ex.: Política de Cookies).
  document.addEventListener('cookie-prefs-open', openModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      mount.querySelector('[data-modal-backdrop]')?.remove();
    }
  });

  if (hasConsent()) {
    return;
  }

  // Nenhum script externo é carregado; adicionamos apenas o banner visual.
  mount.innerHTML = bannerTemplate();
  applyTranslations(mount);
  banner = mount.querySelector<HTMLElement>('#cookie-banner');

  mount.querySelector('[data-cookie="accept"]')?.addEventListener('click', () => {
    saveConsent({ necessary: true, analytics: true, advertising: true });
    closeBanner();
  });

  mount.querySelector('[data-cookie="reject"]')?.addEventListener('click', () => {
    saveConsent({ necessary: true, analytics: false, advertising: false });
    closeBanner();
  });

  mount.querySelector('[data-cookie="config"]')?.addEventListener('click', openModal);
}