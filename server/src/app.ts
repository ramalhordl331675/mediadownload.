import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import type { EnvConfig } from './config';
import { AdapterRegistry } from './adapters/registry';
import { registerPlatforms } from './adapters/platforms';
import { Processor } from './services/processor';
import { Semaphore } from './services/semaphore';
import { TempFiles } from './services/tempFiles';
import { Logger } from './services/logs';
import { MessageStore } from './services/messages';
import { processRoutes } from './routes/process';
import { downloadRoutes, type Downloader } from './routes/download';
import { contactRoutes } from './routes/contact';
import { publicConfigRoutes } from './routes/config';

export interface AppDeps {
  config: EnvConfig;
  logger?: Logger;
  tempFiles?: TempFiles;
  semaphore?: Semaphore;
  messages?: MessageStore;
  registry?: AdapterRegistry;
  downloader?: Downloader;
}

export interface BuiltApp {
  app: FastifyInstance;
  logger: Logger;
  tempFiles: TempFiles;
  semaphore: Semaphore;
  messages: MessageStore;
  registry: AdapterRegistry;
}

/**
 * Constrói a aplicação Fastify completa, com dependências injetáveis.
 * Em testes, é possível trocar registry/semaphore/downloader por falses.
 */
export async function buildApp(deps: AppDeps): Promise<BuiltApp> {
  const config = deps.config;

  const logger = deps.logger ?? new Logger(config.logDir);
  const tempFiles = deps.tempFiles ?? new TempFiles(config.tempDir, config.downloadDir, config.tempFileTtlMs);
  const semaphore = deps.semaphore ?? new Semaphore(config.maxConcurrent);
  const messages = deps.messages ?? new MessageStore(config.logDir);
  const registry = deps.registry ?? new AdapterRegistry();

  await tempFiles.init();
  if (!deps.registry) {
    registerPlatforms(registry, config);
  }

  const app: FastifyInstance = Fastify({ logger: false });

  await app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindowMs,
  });

  await app.register(cors, {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
  });

  // Headers de segurança (não dependem de bibliotecas adicionais)
  app.addHook('onSend', async (_req, reply) => {
    void reply.header('X-Content-Type-Options', 'nosniff');
    void reply.header('X-Frame-Options', 'DENY');
    void reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    void reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  });

  app.get('/health', async () => ({ ok: true }));

  publicConfigRoutes(app, config);

  const processor = new Processor(registry, {
    followRedirects: config.ssrfFollowRedirects,
    redirectTimeoutMs: config.ssrfRedirectTimeoutMs,
  });

  processRoutes(app, { processor, logger });
  downloadRoutes(app, { config, semaphore, tempFiles, logger, downloader: deps.downloader });
  contactRoutes(app, { logger, messages });

  return { app, logger, tempFiles, semaphore, messages, registry };
}
