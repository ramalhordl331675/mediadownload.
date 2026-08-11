import { mountShell } from '../bootstrap';
import { institutionalPage } from './pageLayout';

export function renderTermos(): void {
  const html = institutionalPage('Legal', 'Termos de Uso', 'As condições para usar o MediaSnap.', [
    {
      title: 'Aceitação',
      body: ['Ao acessar ou utilizar este serviço, você concorda com estes Termos de Uso. Se não concordar, não utilize a ferramenta.'],
    },
    {
      title: 'Uso permitido',
      body: [
        'O serviço processa URLs públicas de mídia e disponibiliza opções de download quando tecnicamente e legalmente permitido.',
        'É permitido usar a ferramenta apenas para conteúdos que você possui, tem autorização para utilizar ou cujo download seja expressamente permitido pela plataforma.',
      ],
      bullets: [
        'Não utilize o serviço para burlar DRM, paywalls, autenticação ou qualquer sistema de proteção.',
        'Não utilize o serviço para acessar conteúdos privados ou restritos.',
        'Não utilize o serviço de forma automatizada ou abusiva.',
      ],
    },
    {
      title: 'Responsabilidade do usuário',
      body: [
        'Você é o único responsável pelo uso que faz do serviço e pelos conteúdos que processa, incluindo o cumprimento das leis aplicáveis e dos termos das plataformas de origem.',
      ],
    },
    {
      title: 'Propriedade intelectual',
      body: ['Todos os conteúdos processados pertencem aos seus respectivos titulares. Este serviço não reivindica propriedade sobre eles.'],
    },
    {
      title: 'Conteúdo de terceiros',
      body: [
        'A disponibilidade de qualquer conteúdo depende das permissões da plataforma de origem. Não garantimos que um conteúdo específico possa ser processado.',
      ],
    },
    {
      title: 'Disponibilidade e limitações',
      body: [
        'O serviço é fornecido no estado em que se encontra, sem garantias de disponibilidade ininterrupta ou de que toda URL será processada com sucesso. Podemos limitar requisições para proteger a infraestrutura.',
      ],
    },
    {
      title: 'Suspensão de uso abusivo',
      body: ['Podemos suspender ou limitar o acesso de usuários que utilizem o serviço de forma abusiva, fraudulenta ou que comprometam a operação.'],
    },
    {
      title: 'Alterações',
      body: ['Estes Termos podem ser alterados a qualquer momento. Alterações entram em vigor quando publicadas nesta página.'],
    },
    {
      title: 'Contato',
      body: ['Dúvidas sobre estes Termos: página de Contato ou [E-MAIL].'],
    },
  ]);

  mountShell(html);
}

renderTermos();