import { mountShell } from '../bootstrap';
import { institutionalPage } from './pageLayout';

export function renderSobre(): void {
  const html = institutionalPage('Sobre', 'Sobre nós', 'Uma ferramenta simples, focada no essencial.', [
    {
      title: 'Nosso objetivo',
      body: [
        'O MediaSnap foi criado para tornar simples um processo que costuma ser confuso: obter conteúdo a partir de URLs públicas de plataformas sociais e de vídeo.',
        'Acreditamos que a tecnologia deve resolver esse problema de forma direta — sem cadastros desnecessários, sem instalações e sem distrações.',
      ],
    },
    {
      title: 'Como funciona',
      body: [
        'Você cola uma URL pública no campo principal, o sistema valida e identifica a plataforma, processa o conteúdo e apresenta apenas as opções realmente disponíveis.',
        'Nenhum formato ou qualidade é inventado: se uma opção não aparece, é porque não está tecnicamente permitida para aquele conteúdo.',
      ],
    },
    {
      title: 'Compromisso com a simplicidade',
      body: [
        'Tudo foi projetado para que você entenda o que fazer em poucos segundos. O campo de URL é o centro da experiência e o fluxo tem o menor número possível de passos.',
      ],
    },
    {
      title: 'Privacidade',
      body: [
        'Não pedimos informações pessoais para usar a ferramenta básica. Arquivos temporários são removidos automaticamente e logs são mantidos sem dados sensíveis.',
      ],
    },
    {
      title: 'Segurança',
      body: [
        'Validamos todas as entradas no servidor, protegemos a infraestrutura contra abuso e nunca expomos detalhes técnicos internos.',
      ],
    },
    {
      title: 'Uso responsável',
      body: [
        'Use esta ferramenta somente para baixar conteúdos que você possui, tem autorização para utilizar ou cujo download seja permitido pelos termos da respectiva plataforma.',
      ],
    },
    {
      title: 'Respeito aos direitos autorais',
      body: [
        'Não contornamos DRM, paywalls, autenticação nem restrições de conteúdo. Nosso serviço não é afiliado, associado nem endossado pelas plataformas mencionadas.',
      ],
    },
  ]);

  mountShell(html);
}

renderSobre();