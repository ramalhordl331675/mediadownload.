import { mountShell } from '../bootstrap';

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function renderContato(): void {
  const form = `
    <form class="contact-form" id="contact-form" novalidate>
      <div class="form-grid">
        <div class="form-field">
          <label for="c-nome">Nome</label>
          <input id="c-nome" name="nome" type="text" autocomplete="name" maxlength="120" required />
        </div>
        <div class="form-field">
          <label for="c-email">E-mail</label>
          <input id="c-email" name="email" type="email" autocomplete="email" maxlength="254" required />
        </div>
      </div>
      <div class="form-field">
        <label for="c-assunto">Assunto</label>
        <input id="c-assunto" name="assunto" type="text" maxlength="200" required />
      </div>
      <div class="form-field">
        <label for="c-mensagem">Mensagem</label>
        <textarea id="c-mensagem" name="mensagem" rows="6" maxlength="5000" required></textarea>
      </div>

      <!-- Honeypot anti-spam: humanos não enxergam -->
      <div class="hp-field" aria-hidden="true">
        <label for="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabindex="-1" autocomplete="off" />
      </div>

      <p class="form-note">Ao enviar, você concorda em receber resposta somente sobre este assunto. Seus dados não são usados para outros fins.</p>
      <button class="btn btn-primary" type="submit" id="c-submit">Enviar mensagem</button>
      <p class="form-status" id="c-status" role="status" aria-live="polite"></p>
    </form>
  `;

  const html = `
    <section class="page-hero">
      <div class="container">
        <span class="section-eyebrow">Contato</span>
        <h1>Fale conosco</h1>
        <p class="page-sub">Dúvidas, sugestões ou questões sobre direitos de conteúdo.</p>
      </div>
    </section>
    <section class="section page-body">
      <div class="container">
        <div class="contact-layout">
          <div class="prose">
            <p>Estamos disponíveis para perguntas sobre a ferramenta e questões relacionadas a direitos de conteúdo.</p>
            <p>Se você detém direitos sobre algum material processado por este serviço, descreva o caso com o máximo de detalhes para que possamos avaliar com responsabilidade.</p>
            <p><strong>Resposta:</strong> em geral no prazo de alguns dias úteis. Não armazenamos seus dados além do necessário para responder.</p>
          </div>
          ${form}
        </div>
      </div>
    </section>
  `;

  const { app } = mountShell(html);
  initContactForm(app);
}

function initContactForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('#contact-form');
  if (!form) return;

  const status = root.querySelector<HTMLElement>('#c-status');
  const submit = root.querySelector<HTMLButtonElement>('#c-submit');
  const honeypot = root.querySelector<HTMLInputElement>('#c-website');

  const setStatus = (message: string, kind: 'ok' | 'error' | ''): void => {
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!submit) return;

    setStatus('', '');
    submit.disabled = true;

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const assunto = form.assunto.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !assunto || !mensagem) {
      setStatus('Preencha nome, assunto e mensagem.', 'error');
      submit.disabled = false;
      return;
    }
    if (!VALID_EMAIL.test(email)) {
      setStatus('Informe um e-mail válido.', 'error');
      submit.disabled = false;
      return;
    }
    if (mensagem.length < 10) {
      setStatus('A mensagem precisa ter pelo menos 10 caracteres.', 'error');
      submit.disabled = false;
      return;
    }

    const payload = {
      nome,
      email,
      assunto,
      mensagem,
      website: honeypot ? honeypot.value : '',
    };

    try {
      const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
      const url = base ? `${base.replace(/\/+$/, '')}/api/contact` : '/api/contact';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('Sua mensagem foi enviada com sucesso.', 'ok');
        form.reset();
      } else {
        setStatus('Não foi possível enviar agora. Tente novamente em instantes.', 'error');
      }
    } catch {
      setStatus('Falha de conexão. Verifique sua internet e tente novamente.', 'error');
    } finally {
      submit.disabled = false;
    }
  });

  form.addEventListener('input', () => {
    if (status?.dataset.kind) {
      setStatus('', '');
    }
  });
}

renderContato();