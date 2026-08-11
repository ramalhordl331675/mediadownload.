import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { Processor } from '../services/processor';
import type { Logger } from '../services/logs';

const processBody = z.object({
  url: z.string().trim().min(1).max(2048),
});

interface ProcessDeps {
  processor: Processor;
  logger: Logger;
}

export function processRoutes(app: FastifyInstance, deps: ProcessDeps): void {
  app.post('/api/process', async (req: FastifyRequest, reply: FastifyReply) => {
    const started = Date.now();
    const parsed = processBody.safeParse(req.body);

    if (!parsed.success) {
      await deps.logger.log({
        ts: new Date().toISOString(),
        endpoint: '/api/process',
        status: 400,
        durationMs: Date.now() - started,
        ip: req.ip,
        error: 'url-invalid',
      });
      return reply.status(400).send({ ok: false, error: 'url-invalid' });
    }

    const result = await deps.processor.process(parsed.data.url);

    if (result.error) {
      await deps.logger.log({
        ts: new Date().toISOString(),
        endpoint: '/api/process',
        status: 400,
        durationMs: Date.now() - started,
        ip: req.ip,
        error: result.error,
      });
      return reply.status(400).send({ ok: false, error: result.error });
    }

    if (result.data) {
      await deps.logger.log({
        ts: new Date().toISOString(),
        endpoint: '/api/process',
        status: 200,
        durationMs: Date.now() - started,
        ip: req.ip,
        platform: result.data.platform,
        formats: result.data.formats.length,
      });
      return reply.send({ ok: true, data: result.data });
    }

    await deps.logger.log({
      ts: new Date().toISOString(),
      endpoint: '/api/process',
      status: 400,
      durationMs: Date.now() - started,
      ip: req.ip,
      error: 'process-failed',
    });
    return reply.status(400).send({ ok: false, error: 'process-failed' });
  });
}