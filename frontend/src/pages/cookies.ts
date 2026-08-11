import { mountShell } from '../bootstrap';
import { institutionalPage } from './pageLayout';

export function renderCookies(): void {
  const html =
    institutionalPage('Legal', 'Política de Cookies', 'Como usamos cookies e como você controla isso.', [
      {
        title: 'Cookies essenciais',
        body: ['Necessários para o funcionamento básico do site, como lembrar sua preferência de tema e consentimento. Não podem ser desativados.'],
      },
      {
        title: 'Cookies analíticos',
        body: ['Usados, quando autorizados, para entender como o site é utilizado. Trabalham apenas com dados anônimos e agregados.'],
      },
      {
        title: 'Cookies de publicidade',
        body: ['Usados, quando autorizados, para exibir anúncios relevantes. Não utilizamos anúncios enganosos nem cliques incentivados.'],
      },
      {
        title: 'Finalidade',
        body: ['Os cookies nos ajudam a entregar um serviço mais estável e uma experiência melhor, respeitando a sua escolha.'],
      },
      {
        title: 'Gerenciamento e consentimento',
        body: ['Você pode aceitar, recusar ou configurar cada categoria a qualquer momento pelo painel abaixo.'],
      },
      {
        title: 'Atualização',
        body: ['Esta política pode ser revisada periodicamente. A versão vigente será sempre a publicada nesta página.'],
      },
    ]) +
    `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="cookie-config-call">
          <button class="btn btn-primary" type="button" id="cookie-config-btn">
            Abrir painel de preferências de cookies
          </button>
        </div>
      </div>
    </section>`;

  const { app } = mountShell(html);

  app.querySelector<HTMLButtonElement>('#cookie-config-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('cookie-prefs-open'));
  });
}

renderCookies();