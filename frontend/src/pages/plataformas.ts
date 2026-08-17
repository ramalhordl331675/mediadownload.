import { mountShell } from '../bootstrap';
import { PLATFORMS, initPlatforms } from '../components/sections';
import { institutionalPage } from './pageLayout';

export function renderPlataformas(): void {
  const cards = `
    <section class="section platform-cards-reuse" style="padding:1rem 0 2.5rem">
      <div class="container">
        <div class="platform-grid">${PLATFORMS.map(
          (p) => `
          <button class="platform-card" type="button" data-platform="${p.name}" data-i18n-title="platforms.public">
            <span class="platform-badge" aria-hidden="true">${p.initial}</span>
            <span class="platform-name">${p.name}</span>
            <span class="platform-sub" data-i18n="platforms.public">URLs públicas</span>
          </button>`,
        ).join('')}
        </div>
      </div>
    </section>
  `;

  const html =
    institutionalPage('Plataformas', 'Plataformas compatíveis', 'Trabalhamos com URLs públicas. A disponibilidade depende do conteúdo.', [
      {
        title: 'Como a compatibilidade funciona',
        body: [
          'O sistema identifica a plataforma pela URL e analisa o conteúdo com ferramentas de extração públicas e documentadas.',
          'A disponibilidade de cada formato e qualidade depende exclusivamente do que a plataforma e o próprio conteúdo permitem.',
        ],
      },
      {
        title: 'Atalhos de URL',
        body: ['Links curtos oficiais também são reconhecidos automaticamente (ex.: youtu.be, fb.watch, vm.tiktok.com, pin.it, redd.it).'],
      },
      {
        title: 'Importante',
        body: [],
        bullets: [
          'Não contornamos DRM, paywalls, autenticação ou conteúdo privado.',
          'Não somos afiliados, associados ou endossados por nenhuma dessas plataformas.',
          'A disponibilidade pode variar conforme as características da plataforma e as permissões do conteúdo.',
        ],
      },
    ]) + cards;

  const { app } = mountShell(html);
  initPlatforms(app);
}

renderPlataformas();