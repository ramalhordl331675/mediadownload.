import { mountShell } from '../bootstrap';

export function renderNotFound(): void {
  const html = `
    <section class="section notfound">
      <div class="container">
        <div class="notfound-wrap">
          <span class="notfound-code" aria-hidden="true">404</span>
          <h1>Ops! Essa página não foi encontrada.</h1>
          <p>O endereço pode ter mudado ou não existir. Vamos voltar para o início?</p>
          <a class="btn btn-primary" href="./">Voltar para o início</a>
        </div>
      </div>
    </section>
  `;

  mountShell(html);
}

renderNotFound();