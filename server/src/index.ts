import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';
import fastifyStatic from '@fastify/static';

// .env na raiz do monorepo, independente do cwd.
loadEnv({ path: path.resolve(import.meta.dirname, '../..', '.env') });

import { loadConfig } from './config';
import { buildApp } from './app';

const config = loadConfig();
const { app, tempFiles } = await buildApp({ config });

// Opcional: servir o frontend estático construído no mesmo processo.
// Habilitado quando FRONTEND_DIST aponta para o diretório dist/ do frontend.
const frontendDist = config.frontendDist
  ? path.resolve(import.meta.dirname, '../..', config.frontendDist)
  : '';
if (frontendDist && existsSync(frontendDist)) {
  await app.register(fastifyStatic, {
    root: frontendDist,
    wildcard: false,
    maxAge: '1h',
  });

  app.setNotFoundHandler(async (req, reply) => {
    if (req.url.startsWith('/api/')) {
      return reply.status(404).send({ ok: false, error: 'NOT_FOUND' });
    }
    const notFound = path.join(frontendDist, '404.html');
    if (existsSync(notFound)) {
      return reply.code(404).type('text/html').send(readFileSync(notFound));
    }
    return reply.status(404).send({ ok: false, error: 'NOT_FOUND' });
  });

  app.log.info(`Servindo frontend estático de ${frontendDist}`);
}

// Limpeza periódica de arquivos temporários
const sweeper = setInterval(() => {
  void tempFiles.sweepAll();
}, Math.min(config.tempFileTtlMs, 3_600_000));
sweeper.unref();

const shutdown = async (signal: string): Promise<void> => {
  app.log.info(`Recebido ${signal}, encerrando...`);
  clearInterval(sweeper);
  await app.close();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

try {
  await app.listen({ port: config.port, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}