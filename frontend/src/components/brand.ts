/**
 * Marca MediaSnap: mark (logotipo SVG) + wordmark.
 * Reutilizado no header, footer e favicon.
 */
export const BRAND_NAME = 'MediaSnap';
export const BRAND_TAGLINE = 'Cole. Processe. Baixe.';

/** Logotipo (apenas o símbolo). */
export function brandMarkHtml(): string {
  return `
    <svg class="brand-logo" viewBox="0 0 40 40" width="38" height="38" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ms-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#3B82F6"/>
          <stop offset="1" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#ms-grad)"/>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <path d="M20 10v15" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M13 19l7 7 7-7" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 33h20" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
    </svg>
  `;
}

/** Wordmark "MediaSnap" com texto. */
export function brandWordmarkHtml(className = ''): string {
  return `
    <span class="brand-wordmark ${className.trim()}">${BRAND_NAME}</span>
  `;
}

/** Bloco completo da marca (logotipo + wordmark), usado no header/footer. */
export function brandBlockHtml(href: string, ariaLabel: string): string {
  return `
    <a class="brand" href="${href}" aria-label="${ariaLabel}">
      ${brandMarkHtml()}
      ${brandWordmarkHtml()}
    </a>
  `;
}

/** Favicon em data-URI (SVG inline) para substituir o placeholder. */
export function brandFaviconDataUri(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect x="2" y="2" width="36" height="36" rx="11" fill="url(#g)"/><path d="M20 10v15" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M13 19l7 7 7-7" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 33h20" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}