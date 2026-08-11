import { fetchConfig, type PublicConfig } from '../services/api';
import { CONSENT_EVENT, hasConsent, loadScript, readConsent } from '../services/consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

/**
 * Carrega scripts de análise (GA4) e publicidade (AdSense) apenas quando:
 *  - o proprietário configurou IDs reais via /api/config; e
 *  - o usuário consentiu com a respectiva categoria de cookies.
 * Sem ID real ou sem consentimento, nada é carregado.
 */
export async function initScripts(): Promise<void> {
  let config: PublicConfig = {};
  try {
    const res = await fetchConfig();
    config = res.data ?? {};
  } catch {
    return;
  }

  const apply = (): void => {
    const prefs = readConsent();
    if (config.ga4Id) {
      if (prefs.analytics) loadGtag(config.ga4Id);
      else unloadGtag();
    }
    if (config.adsenseId) {
      if (prefs.advertising) void loadAdSense(config.adsenseId);
      else unloadAdSense();
    }
  };

  window.addEventListener(CONSENT_EVENT, apply);

  // Aplica apenas com consentimento prévio (sem pop-up, não carrega scripts).
  if (hasConsent()) {
    apply();
  }
}

function loadGtag(id: string): void {
  const existing = document.querySelector('script[data-gtag]');
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.dataset.gtag = id;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag(..._args: unknown[]): void {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

function unloadGtag(): void {
  document.querySelectorAll('script[data-gtag]').forEach((el) => el.remove());
  window.gtag = undefined;
}

function loadAdSense(client: string): void {
  void loadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`);
  document.querySelectorAll<HTMLElement>('.ad-slot[data-adsense]').forEach((slot) => {
    slot.classList.add('is-ready');
  });
}

function unloadAdSense(): void {
  document.querySelectorAll('script[src*="adsbygoogle"]').forEach((el) => el.remove());
  document.querySelectorAll<HTMLElement>('.ad-slot[data-adsense]').forEach((slot) => {
    slot.classList.remove('is-ready');
  });
}
