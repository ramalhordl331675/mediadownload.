# MediaSnap

> **Cole. Processe. Baixe.**

Plataforma web simples para processar URLs públicas de mídia e oferecer opções de download quando tecnicamente e legalmente permitido.

> Use esta ferramenta somente para baixar conteúdos que você possui, tem autorização para utilizar ou cujo download seja permitido pelos termos da respectiva plataforma.

## Requisitos

- Node.js >= 22
- npm >= 10
- `yt-dlp` disponível na `PATH` (ou configurado via `YT_DLP_PATH`)
- `ffmpeg` disponível na `PATH` (combinação de vídeo/áudio e conversão MP3)

## Instalação

```bash
npm install
cp .env.example .env
```

Edite o `.env` conforme necessário.

## Desenvolvimento

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000

Ou em terminais separados:

```bash
npm run dev:frontend
npm run dev:server
```

## Build e produção

```bash
npm run build     # frontend + server
npm start         # inicia a API em produção
```

## Variáveis de ambiente

Ver `.env.example` para todas as variáveis. Nenhuma chave real deve ser enviada ao repositório.

## Arquitetura

```
frontend/           Vite + TypeScript (HTML/CSS próprios)
  src/main.ts       Composição da Home
  src/components/   Header, ferramenta de URL, seções, cookies, ads
  src/services/     Cliente da API
server/             Fastify + TypeScript
  src/index.ts      Bootstrap, segurança, agendamento de limpeza
  src/config/       Configuração via env
  src/routes/       /api/process e /api/download
  src/adapters/     PlatformAdapter (uma implementação por plataforma)
  src/services/     Processor, yt-dlp, semáforo, logs, temporários
  src/utils/        urlGuard (validação + proteção anti-SS RF)
```

### API

- `GET /health` — sinal de vida.
- `GET /api/config` — configuração pública (IDs de AdSense/GA4/analytics quando definidos).
- `POST /api/process` — `{ url }` → metadados + formatos disponíveis (nada é inventado).
- `GET /api/download?url=...&format=MP4|MP3&quality=...` — baixa via servidor, faz streaming
  com `Content-Length`/`Content-Type` corretos e remove o arquivo temporário ao final.

### Adicionar uma nova plataforma

1. Implemente a interface `PlatformAdapter` (`server/src/adapters/types.ts`).
2. Registre o adapter em `server/src/index.ts`.

## Fluxo

1. Usuário cola uma URL pública.
2. Backend valida a URL e bloqueia acessos a recursos internos (SSRF).
3. O adapter correspondente analisa o conteúdo e devolve opções disponíveis.
4. O servidor serve apenas formatos/qualidades reais — nada é inventado.

## Segurança

- Validação e sanitização no backend.
- Rate limiting por IP.
- Proteção contra SSRF (bloqueio de IPs privados e hosts internos).
- Semáforo de concorrência (impede abuso de recursos).
- Timeouts e limites de tamanho em metadados e downloads.
- Parâmetros do yt-dlp validados (sem injeção de argumentos).
- Arquivos temporários removidos após o streaming e por job periódico.
- Headers de segurança (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Erros técnicos nunca são expostos ao usuário.
- Logs JSONL em `logs/` com IP anonimizado e sem dados sensíveis.

## Manutenção

- Arquivos temporários são removidos automaticamente (`TEMP_FILE_TTL_MS`) por um job periódico.
- Logs de operação ficam em `logs/app.log` (JSONL) — timestamp, endpoint, plataforma, status, duração, IP anonimizado, erro.
- `yt-dlp` precisa estar na `PATH` ou apontado em `YT_DLP_PATH`; `ffmpeg` é usado para combinar vídeo/áudio e converter para MP3.

## Monetização e analytics

O projeto está preparado para AdSense e GA4, mas **nada é carregado sem consentimento nem sem ID real**:

- Defina `ADSENSE_ID`, `GA4_ID` e/ou `ANALYTICS_ID` no `.env`. O servidor expõe esses IDs
  (quando definidos) via `GET /api/config`.
- O frontend busca essa configuração e só injeta os scripts se o usuário tiver consentido
  com a categoria correspondente (publicidade/analítica) no banner de cookies.
- Com IDs vazios, os scripts não são carregados e os espaços de anúncio ficam apenas reservados.

> Não insira IDs reais de produção no repositório — eles pertencem ao `.env` do servidor.