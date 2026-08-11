/**
 * Espaços reservados para publicidade (AdSense).
 * O código oficial só deve ser inserido quando o proprietário fornecer.
 * Visualmente separados da ferramenta para não conflitar com os controles.
 */

function slot(label: string): string {
  return `
    <!-- ADSENSE SLOT: ${label} -->
    <div class="ad-slot" data-adsense="${label}" aria-hidden="true">
      <div class="ad-box">
        <span class="ad-label">Publicidade</span>
      </div>
    </div>
    <!-- /ADSENSE SLOT -->
  `;
}

export function adTopTemplate(): string {
  return slot('header/top');
}

export function adContentTemplate(): string {
  return slot('entre-secoes');
}

export function adSidebarTemplate(): string {
  return slot('sidebar-desktop');
}

export function initAds(_mount: HTMLElement): void {
  // Os slots são apenas reservados. O carregamento real do AdSense é feito
  // por initScripts() somente com ID configurado e consentimento de publicidade.
}