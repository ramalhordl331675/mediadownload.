export interface ConsentPrefs {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
}

export const CONSENT_KEY = 'cookie-consent';
export const CONSENT_EVENT = 'cookie-consent-changed';

const DEFAULT_PREFS: ConsentPrefs = { necessary: true, analytics: false, advertising: false };

export function readConsent(): ConsentPrefs {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<ConsentPrefs>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveConsent(prefs: ConsentPrefs): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/**
 * Carrega um script externo apenas quando necessário.
 * Retorna uma Promise que resolve quando o script terminar de carregar (ou falhar).
 */
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-src="${CSS.escape(src)}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.dataset.src = src;
    script.src = src;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => resolve());
    document.head.appendChild(script);
  });
}
