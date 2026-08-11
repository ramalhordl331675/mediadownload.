import { mountShell } from '../bootstrap';
import { institutionalPage } from './pageLayout';

export function renderComoFunciona(): void {
  const html = institutionalPage('Guia', 'Como funciona', 'Três passos simples para obter o que você precisa.', [
    {
      title: '01 — Cole a URL',
      body: ['Abra o conteúdo em uma plataforma pública, copie o endereço (URL) que aparece no navegador e cole-o no campo principal da Home.'],
    },
    {
      title: '02 — Processe',
      body: ['Clique em "Processar URL". O sistema valida o endereço, identifica a plataforma e analisa o conteúdo. Esse processo leva alguns segundos.'],
    },
    {
      title: '03 — Escolha',
      body: [
        'As opções realmente disponíveis aparecem em um card: formato (vídeo, áudio ou imagem) e qualidade. Escolha uma e clique em Baixar.',
        'Não exibimos opções que não existam para o conteúdo. Por isso, a lista pode variar entre URLs.',
      ],
    },
    {
      title: 'Dicas',
      body: ['Use sempre o link público completo. Links privados ou que exijam login não podem ser processados.'],
      bullets: [
        'Certifique-se de que o conteúdo é público.',
        'Se uma opção não aparece, ela não está disponível para aquele conteúdo.',
        'Sem cadastro e sem instalação: tudo acontece no navegador.',
      ],
    },
    {
      title: 'Uso responsável',
      body: ['Utilize apenas conteúdos que você possui, tem autorização para usar ou cujo download seja permitido pelos termos da plataforma.'],
    },
  ]);

  mountShell(html);
}

renderComoFunciona();