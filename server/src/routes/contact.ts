import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { Logger } from '../services/logs';
import type { MessageStore } from '../services/messages';

const contactBody = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  assunto: z.string().trim().min(1).max(200),
  mensagem: z.string().trim().min(10).max(5000),
  // Honeypot: preenchido apenas por bots. Campo invisível para humanos.
  website: z.string().max(300).optional().default(''),
});

interface ContactDeps {
  logger: Logger;
  messages: MessageStore;
}

export function contactRoutes(app: FastifyInstance, deps: ContactDeps): void {
  app.post('/api/contact', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = contactBody.safeParse(req.body);

    if (!parsed.success) {
      await deps.logger.log({
        ts: new Date().toISOString(),
        endpoint: '/api/contact',
        status: 400,
        durationMs: 0,
        ip: req.ip,
        error: 'invalid',
      });
      return reply.status(400).send({ ok: false, error: 'invalid' });
    }

    const { website, ...data } = parsed.data;

    // Honeypot disparou: responde sucesso para não revelar a armadilha, mas não armazena.
    if (website) {
      return reply.send({ ok: true });
    }

    await deps.messages.append({
      ts: new Date().toISOString(),
      ...data,
      ip: deps.logger.anonymizeIp(req.ip),
    });

    return reply.send({ ok: true });
  });
}