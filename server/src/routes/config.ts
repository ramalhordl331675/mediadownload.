import type { FastifyInstance } from 'fastify';
import type { EnvConfig } from '../config';

/**
 * Configuração pública para o frontend (monetização/análise).
 * IDs de AdSense/GA4 são públicos por natureza; nada de segredo é exposto.
 * Valores vazios são omitidos — o frontend não carrega nada sem ID real.
 */
export function publicConfigRoutes(app: FastifyInstance, config: EnvConfig): void {
  app.get('/api/config', async () => {
    const body: Record<string, string> = {};
    if (config.apiPublicUrl) body.apiPublicUrl = config.apiPublicUrl;
    if (config.adsenseId) body.adsenseId = config.adsenseId;
    if (config.ga4Id) body.ga4Id = config.ga4Id;
    if (config.analyticsId) body.analyticsId = config.analyticsId;
    return { ok: true, data: body };
  });
}
