import { escapeHtml } from '../utils/html';
import { brandMarkHtml, brandWordmarkHtml, BRAND_TAGLINE } from './brand';

export const PLATFORMS = [
  { name: 'YouTube', initial: 'Y' },
  { name: 'Facebook', initial: 'F' },
  { name: 'Instagram', initial: 'I' },
  { name: 'TikTok', initial: 'T' },
  { name: 'Kwai', initial: 'K' },
  { name: 'Pinterest', initial: 'P' },
  { name: 'X', initial: 'X' },
  { name: 'Reddit', initial: 'R' },
] as const;

export function platformsTemplate(): string {
  return `
    <section class="section" id="plataformas" aria-labelledby="plataformas-title">
      <div class="container">
        <div class="section-head">
          <span class="section-eyebrow">Plataformas</span>
          <h2 id="plataformas-title">Plataformas compatíveis</h2>
          <p>Processamos URLs públicas das principais plataformas, sempre de acordo com as permissões de cada conteúdo.</p>
        </div>
        <div class="platform-grid">
          ${PLATFORMS.map(
            (p) => `
            <div class="platform-card">
              <div class="platform-badge" aria-hidden="true">${escapeHtml(p.initial)}</div>
              <h3>${escapeHtml(p.name)}</h3>
              <p>URLs públicas</p>
            </div>`,
          ).join('')}
        </div>
        <p class="disclaimer">A disponibilidade pode variar conforme as características da plataforma e as permissões do conteúdo.</p>
      </div>
    </section>
  `;
}

export function howItWorksTemplate(): string {
  const steps = [
    {
      num: '01',
      title: 'Cole a URL',
      text: 'Copie a URL pública do conteúdo desejado.',
    },
    {
      num: '02',
      title: 'Processe',
      text: 'Cole no campo e clique em processar.',
    },
    {
      num: '03',
      title: 'Escolha',
      text: 'Selecione uma opção disponível e faça o download.',
    },
  ];

  return `
    <section class="section" id="como-funciona" aria-labelledby="como-funciona-title">
      <div class="container">
        <div class="section-head">
          <span class="section-eyebrow">Como funciona</span>
          <h2 id="como-funciona-title">Três passos simples</h2>
          <p>Sem cadastro, sem instalação e sem complicação.</p>
        </div>
        <div class="steps-grid">
          ${steps
            .map(
              (s) => `
            <div class="step-card">
              <span class="step-num">${s.num}</span>
              <h3>${escapeHtml(s.title)}</h3>
              <p>${escapeHtml(s.text)}</p>
            </div>`,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function benefitsTemplate(): string {
  const benefits = [
    {
      icon: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>',
      title: 'Rápido',
      text: 'Processamento otimizado para entregar opções o quanto antes.',
    },
    {
      icon: '<path d="M4 8h16M4 16h16"/><circle cx="19" cy="8" r="2"/><circle cx="19" cy="16" r="2"/>',
      title: 'Simples',
      text: 'Interface sem complicação: cole, processe e escolha.',
    },
    {
      icon: '<rect x="2" y="4" width="20" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>',
      title: 'Responsivo',
      text: 'Funciona em celular, tablet e computador.',
    },
    {
      icon: '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="m9 12 2 2 4-4"/>',
      title: 'Privacidade',
      text: 'Não solicitamos informações pessoais desnecessárias.',
    },
    {
      icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      title: 'Acessível',
      text: 'Ferramenta básica disponível sem barreiras de cadastro.',
    },
    {
      icon: '<path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M18 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      title: 'Seguro',
      text: 'Validação no servidor e proteção contra abuso e acesso indevido.',
    },
  ];

  return `
    <section class="section" id="vantagens" aria-labelledby="vantagens-title">
      <div class="container">
        <div class="section-head text-center" style="margin-inline: auto">
          <span class="section-eyebrow">Vantagens</span>
          <h2 id="vantagens-title">Pensado para você</h2>
          <p>Simplicidade e performance em primeiro lugar.</p>
        </div>
        <div class="benefit-grid">
          ${benefits
            .map(
              (b) => `
            <div class="benefit-card">
              <div class="benefit-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${b.icon}</svg>
              </div>
              <h3>${escapeHtml(b.title)}</h3>
              <p>${escapeHtml(b.text)}</p>
            </div>`,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function trustTemplate(): string {
  const items = [
    { value: 'Sem cadastro', label: 'use direto da Home' },
    { value: 'Sem instalação', label: '100% no navegador' },
    { value: 'Sem dados pessoais', label: 'privacidade primeiro' },
    { value: 'Sempre do servidor', label: 'sem proxy arbitrário' },
  ];

  return `
    <section class="section" aria-labelledby="confianca-title" id="confianca">
      <div class="container">
        <div class="trust-strip">
          ${items
            .map(
              (i) => `
            <div class="trust-item">
              <strong>${escapeHtml(i.value)}</strong>
              <span>${escapeHtml(i.label)}</span>
            </div>`,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: 'Como baixar um vídeo?',
    a: 'Cole a URL pública do vídeo no campo principal, clique em "Processar URL" e escolha uma das opções disponíveis apresentadas.',
  },
  {
    q: 'Quais plataformas são compatíveis?',
    a: 'Trabalhamos com URLs públicas de plataformas como YouTube, Facebook, Instagram, TikTok, Kwai, Pinterest, X e Reddit. A disponibilidade real depende das permissões de cada conteúdo.',
  },
  {
    q: 'Preciso instalar algum programa?',
    a: 'Não. Tudo acontece no navegador. Você cola a URL, processa e escolhe a opção disponível diretamente no site.',
  },
  {
    q: 'Funciona no celular?',
    a: 'Sim. A interface é desenvolvida primeiro para celular e funciona em qualquer tamanho de tela, do smartphone ao desktop.',
  },
  {
    q: 'Posso baixar imagens?',
    a: 'Em algumas plataformas, imagens disponíveis publicamente podem ser processadas. A disponibilidade varia conforme a plataforma e as permissões do conteúdo.',
  },
  {
    q: 'O serviço é gratuito?',
    a: 'A ferramenta básica está disponível de forma gratuita, sem cadastro. Não prometemos funcionalidades pagas adicionais no momento.',
  },
  {
    q: 'Por que algumas URLs não funcionam?',
    a: 'Vários motivos podem impedir o processamento: conteúdo privado, proteções técnicas, restrições da plataforma ou indisponibilidade temporária. Nesses casos mostramos uma mensagem amigável.',
  },
  {
    q: 'Por que determinado formato não aparece?',
    a: 'Só exibimos formatos e qualidades reais do conteúdo. Se uma opção não aparece, significa que ela não está tecnicamente disponível para aquele item.',
  },
  {
    q: 'O conteúdo fica armazenado no servidor?',
    a: 'Arquivos temporários são criados apenas durante o processamento e removidos automaticamente após o período necessário. Não mantemos downloads indefinidamente.',
  },
  {
    q: 'Posso baixar qualquer conteúdo?',
    a: 'Não. Use a ferramenta somente para conteúdos que você possui, tem autorização para utilizar ou cujo download seja permitido pelos termos da plataforma.',
  },
  {
    q: 'O que devo fazer se tenho direitos sobre o conteúdo?',
    a: 'Entre em contato pela página de Contato detalhando o caso. Tratamos questões de direitos com a responsabilidade adequada.',
  },
  {
    q: 'Por quanto tempo os arquivos ficam disponíveis?',
    a: 'Arquivos temporários têm vida curta por segurança e são excluídos automaticamente. Baixe o que precisa enquanto a opção estiver disponível.',
  },
];

export function faqTemplate(): string {
  return `
    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="container">
        <div class="section-head">
          <span class="section-eyebrow">FAQ</span>
          <h2 id="faq-title">Perguntas frequentes</h2>
          <p>Respostas diretas para as dúvidas mais comuns.</p>
        </div>
        <div class="faq-list">
          ${FAQ_ITEMS.map(
            (item, i) => `
            <div class="faq-item" id="faq-item-${i}">
              <h3>
                <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-answer-${i}" data-faq-q>
                  <span>${escapeHtml(item.q)}</span>
                  <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </h3>
              <div class="faq-answer" id="faq-answer-${i}" role="region">
                <p>${escapeHtml(item.a)}</p>
              </div>
            </div>`,
          ).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initFaq(mount: HTMLElement): void {
  const items = new Map<HTMLButtonElement, HTMLElement>();

  mount.querySelectorAll<HTMLButtonElement>('[data-faq-q]').forEach((q, i) => {
    const answer = mount.querySelector<HTMLElement>(`#faq-answer-${i}`);
    if (answer) items.set(q, answer);

    q.addEventListener('click', () => {
      const isOpen = q.getAttribute('aria-expanded') === 'true';

      items.forEach((a) => {
        a.closest('.faq-item')?.classList.remove('is-open');
      });
      mount.querySelectorAll<HTMLButtonElement>('[data-faq-q]').forEach((other) => {
        other.setAttribute('aria-expanded', 'false');
        other.closest('.faq-item')?.classList.remove('is-open');
      });

      if (!isOpen) {
        q.setAttribute('aria-expanded', 'true');
        q.closest('.faq-item')?.classList.add('is-open');
        const answer = items.get(q);
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // Sincroniza a altura quando a janela muda (ex.: orientação)
  window.addEventListener('resize', () => {
    items.forEach((answer, q) => {
      if (q.getAttribute('aria-expanded') === 'true') {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

export function ctaTemplate(): string {
  return `
    <section class="section" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-wrap">
          <h2 id="cta-title">Pronto para começar?</h2>
          <p>Cole sua primeira URL e veja o que está disponível em segundos.</p>
          <a class="btn btn-invert" href="#url-input">Cole sua URL agora</a>
        </div>
      </div>
    </section>
  `;
}

const FOOTER_LINKS = {
  Ferramenta: [
    { label: 'Como funciona', href: './como-funciona.html' },
    { label: 'Plataformas', href: './plataformas.html' },
    { label: 'FAQ', href: './faq.html' },
  ],
  Empresa: [
    { label: 'Sobre', href: './sobre.html' },
    { label: 'Contato', href: './contato.html' },
  ],
  Legal: [
    { label: 'Privacidade', href: './privacidade.html' },
    { label: 'Termos de Uso', href: './termos.html' },
    { label: 'Cookies', href: './cookies.html' },
  ],
};

export function sobreTemplate(): string {
  return `
    <section class="section" id="sobre" aria-labelledby="sobre-title">
      <div class="container">
        <div class="section-head">
          <span class="section-eyebrow">Sobre</span>
          <h2 id="sobre-title">Uma ferramenta simples, focada no essencial</h2>
          <p>
            O MediaSnap nasceu de um objetivo direto: transformar o processo de
            obter conteúdo a partir de URLs públicas em algo rápido e intuitivo.
            Nossa prioridade é a simplicidade — e o respeito pelas plataformas e
            pelos direitos de quem cria conteúdo.
          </p>
        </div>
      </div>
    </section>
  `;
}

export function footerTemplate(): string {
  const cols = Object.entries(FOOTER_LINKS)
    .map(
      ([title, links]) => `
      <div class="footer-col">
        <h4>${escapeHtml(title)}</h4>
        <ul>
          ${links.map((l) => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`).join('')}
        </ul>
      </div>`,
    )
    .join('');

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="./">
              ${brandMarkHtml()}
              ${brandWordmarkHtml()}
            </a>
            <p>${BRAND_TAGLINE} Ferramenta simples para processar URLs públicas e oferecer opções de download quando permitido.</p>
          </div>
          ${cols}
        </div>
        <div class="footer-bottom">
          <span>© <span id="footer-year"></span> MediaSnap. Todos os direitos reservados.</span>
          <span>Este serviço não possui afiliação, associação ou endosso oficial pelas plataformas mencionadas.</span>
        </div>
      </div>
    </footer>
  `;
}

export function initFooter(mount: HTMLElement): void {
  const year = mount.querySelector<HTMLElement>('#footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
}