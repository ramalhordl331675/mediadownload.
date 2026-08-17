# ---- Etapa 1: build do frontend + servidor ----
FROM node:22-slim AS build

WORKDIR /app

# Copia apenas os manifestos primeiro (aproveita cache de camadas)
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY server/package.json ./server/
RUN npm ci

# Código-fonte
COPY . .

# URL pública da API embutida no frontend.
# Vazio (padrão) = mesmo domínio (recomendado no deploy de peça única).
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Etapa 2: imagem de produção ----
FROM node:22-slim AS runtime

ENV NODE_ENV=production

# ffmpeg (combinar/convertir) + python3 (necessario para o binario do yt-dlp)
# + ferramentas para baixar o yt-dlp
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg python3 curl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && curl -L --fail --silent --show-error \
       -o /usr/local/bin/yt-dlp \
       https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  && chmod a+x /usr/local/bin/yt-dlp \
  && yt-dlp --version \
  && rm -f /usr/local/bin/curl

WORKDIR /app

# Dependências de runtime (somente produção)
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY server/package.json ./server/
RUN npm ci --omit=dev --workspaces --include-workspace-root --ignore-scripts

# Artefatos construídos
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/frontend/dist ./frontend/dist

# Diretórios de trabalho (temporários, downloads e logs)
RUN mkdir -p temp downloads logs

ENV PORT=3000 \
    FRONTEND_DIST=/app/frontend/dist \
    TEMP_DIR=/app/temp \
    DOWNLOAD_DIR=/app/downloads \
    LOG_DIR=/app/logs \
    YT_DLP_PATH=/usr/local/bin/yt-dlp

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/dist/index.js"]
