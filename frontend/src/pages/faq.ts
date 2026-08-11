import { mountShell } from '../bootstrap';
import { faqTemplate, initFaq } from '../components/sections';
import { institutionalPage } from './pageLayout';

export function renderFaq(): void {
  const html =
    institutionalPage('FAQ', 'Perguntas frequentes', 'Respostas diretas para as dúvidas mais comuns.', [
      {
        title: 'Sobre a ferramenta',
        body: [
          'Confira abaixo as respostas às perguntas mais frequentes. Se a sua dúvida não estiver aqui, fale com a gente pela página de Contato.',
        ],
      },
    ]) +
    `
    <section class="section" style="padding-top:0">
      <div class="container">
        ${faqTemplate()
          .replace('<section class="section" id="faq" aria-labelledby="faq-title">', '')
          .replace('<div class="section-head">', '<div class="section-head" hidden>')
          .replace('</section>', '')}
      </div>
    </section>`;

  const { app } = mountShell(html);
  initFaq(app);
}

renderFaq();