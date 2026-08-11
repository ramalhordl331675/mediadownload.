import { mountShell } from '../bootstrap';
import { PLATFORMS } from '../components/sections';
import { institutionalPage } from './pageLayout';

export function renderPlataformas(): void {
  const cards = `
    <section class="section platform-cards-reuse" style="padding:1rem 0 2.5rem">
      <div class="container">
        <div class="platform-grid">${PLATFORMS.map(
          (p) => `
          <div class="platform-card">
            <div class="platform-badge" aria-hidden="true">${p.initial}</div>
            <h3>${p.name}</h3>
            <p>URLs públicas</p>
          </div>`,
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

  mountShell(html);
}

renderPlataformas();