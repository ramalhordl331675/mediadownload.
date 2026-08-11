import { escapeHtml } from '../utils/html';

export interface PageSection {
  title: string;
  body: string[];
  bullets?: string[];
}

function renderSection(s: PageSection): string {
  const bullets = s.bullets
    ? `<ul>${s.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
    : '';
  return `
    <section aria-labelledby="sec-${escapeHtml(s.title)}">
      <h2 id="sec-${escapeHtml(s.title)}">${escapeHtml(s.title)}</h2>
      ${s.body.map((p) => `<p>${p}</p>`).join('')}
      ${bullets}
    </section>
  `;
}

/** Página institucional: cabeçalho de página + corpo em prosa. */
export function institutionalPage(eyebrow: string, title: string, subtitle: string, sections: PageSection[]): string {
  return `
    <section class="page-hero">
      <div class="container">
        <span class="section-eyebrow">${escapeHtml(eyebrow)}</span>
        <h1>${escapeHtml(title)}</h1>
        <p class="page-sub">${escapeHtml(subtitle)}</p>
      </div>
    </section>
    <section class="section page-body">
      <div class="container">
        <div class="prose">
          ${sections.map(renderSection).join('')}
        </div>
      </div>
    </section>
  `;
}