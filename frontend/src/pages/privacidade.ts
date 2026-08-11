import { mountShell } from '../bootstrap';
import { institutionalPage } from './pageLayout';

export function renderPrivacidade(): void {
  const html = institutionalPage('Legal', 'Política de Privacidade', 'Como tratamos seus dados, com transparência.', [
    {
      title: 'Dados coletados',
      body: [
        'Não exigimos cadastro para usar a ferramenta básica. Portanto, não coletamos nomes, e-mails ou dados pessoais apenas pelo uso do serviço.',
        'Quando você utiliza o formulário de contato, informamos voluntariamente nome, e-mail e mensagem — usados estritamente para responder.',
      ],
    },
    {
      title: 'Dados técnicos',
      body: [
        'Para proteger o serviço contra abuso, registramos informações técnicas limitadas durante as requisições, como endereço IP anonimizado e a plataforma consultada. Esses dados não permitem identificar pessoas.',
      ],
    },
    {
      title: 'Cookies',
      body: ['Este site utiliza cookies essenciais para funcionamento e, mediante consentimento, cookies de análise e publicidade. Veja nossa Política de Cookies para detalhes.'],
    },
    {
      title: 'Logs',
      body: [
        'Mantemos logs de operação com timestamp, endpoint, plataforma, status e erro. O IP é anonimizado e nenhum dado sensível é registrado.',
      ],
    },
    {
      title: 'Finalidade',
      body: ['Os dados técnicos são usados para operação, prevenção de abuso e melhoria do serviço. Dados de contato são usados apenas para responder às mensagens.'],
    },
    {
      title: 'Armazenamento e retenção',
      body: [
        'Arquivos temporários são excluídos automaticamente. Logs são retidos pelo tempo estritamente necessário; mensagens de contato são mantidas apenas enquanto o assunto estiver em tratamento.',
      ],
    },
    {
      title: 'Terceiros e serviços de análise',
      body: [
        'Não compartilhamos dados pessoais com terceiros. Caso venhamos a utilizar ferramentas de análise ou publicidade, apenas dados anônimos e agregados serão envolvidos, sempre conforme a sua preferência de cookies.',
      ],
    },
    {
      title: 'Seus direitos',
      body: ['Você pode solicitar informações, correção ou exclusão dos dados que nos forneceu, escrevendo para [E-MAIL].'],
    },
    {
      title: 'Contato',
      body: ['Dúvidas sobre esta política: [E-MAIL] — [PAÍS].'],
    },
    {
      title: 'Atualização desta política',
      body: ['Esta página pode ser revisada periodicamente. A versão vigente é a publicada em [DATA DE ATUALIZAÇÃO].'],
    },
  ]);

  mountShell(html);
}

renderPrivacidade();