import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';
import { AdapterRegistry } from '../src/adapters/registry';
import { Semaphore } from '../src/services/semaphore';
import type { EnvConfig } from '../src/config';
import type { PlatformAdapter, ProcessResult } from '../src/adapters/types';
import type { Logger } from '../src/services/logs';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    console.error(`FALHOU: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`ok: ${label}`);
  }
}

/** Logger silencioso para não sujar os logs reais durante os testes. */
const nullLogger: Logger = {
  anonymizeIp: (ip: string) => ip ?? 'unknown',
  log: async () => undefined,
} as Logger;

function baseConfig(overrides: Partial<EnvConfig> = {}): EnvConfig {
  return {
    port: 0,
    corsOrigin: 'http://localhost:5173',
    rateLimitMax: 100,
    rateLimitWindowMs: 60_000,
    processTimeoutMs: 5000,
    downloadTimeoutMs: 5000,
    maxResponseBytes: 10_000_000,
    maxConcurrent: 2,
    tempDir: '',
    downloadDir: '',
    logDir: '',
    tempFileTtlMs: 60_000,
    ytDlpPath: 'yt-dlp',
    ssrfFollowRedirects: false,
    ssrfRedirectTimeoutMs: 500,
    ...overrides,
  };
}

class FakeAdapter implements PlatformAdapter {
  readonly name = 'FakePlatform';

  constructor(
    readonly id: string,
    private readonly result: ProcessResult,
    readonly hosts: string[],
  ) {}

  matches(url: URL): boolean {
    return this.hosts.some((h) => url.hostname.endsWith(h));
  }

  async process(_url: URL): Promise<ProcessResult> {
    return this.result;
  }
}

async function makeApp(opts: {
  config?: Partial<EnvConfig>;
  registry?: AdapterRegistry;
  semaphore?: Semaphore;
  downloader?: unknown;
} = {}): Promise<{ app: FastifyInstance; dir: string }> {
  const dir = await mkdtemp(path.join(tmpdir(), 'dawload-test-'));
  const config = baseConfig({
    tempDir: path.join(dir, 'temp'),
    downloadDir: path.join(dir, 'downloads'),
    logDir: path.join(dir, 'logs'),
    ...opts.config,
  });

  const { app } = await buildApp({
    config,
    logger: nullLogger,
    registry: opts.registry,
    semaphore: opts.semaphore,
    downloader: opts.downloader as never,
  });

  return { app, dir };
}

async function cleanup(app: FastifyInstance, dir: string): Promise<void> {
  await app.close();
  await rm(dir, { recursive: true, force: true });
}

const okProcess: ProcessResult = {
  data: {
    title: 'Vídeo de teste',
    platform: 'FakePlatform',
    thumbnail: 'https://example.com/thumb.jpg',
    duration: 120,
    formats: [
      { id: '137', kind: 'video', format: 'MP4', quality: '1080p', ext: 'mp4', size: 1024 },
      { id: '140', kind: 'audio', format: 'MP3', quality: 'áudio', ext: 'mp3', size: 512 },
    ],
  },
};

// ---------------------------------------------------------------- health
{
  const { app, dir } = await makeApp();
  try {
    const res = await app.inject({ method: 'GET', url: '/health' });
    assert(res.statusCode === 200, 'GET /health -> 200');
    assert(res.json().ok === true, 'GET /health -> { ok: true }');
  } finally {
    await cleanup(app, dir);
  }
}

// ---------------------------------------------------------------- /api/config
{
  const { app, dir } = await makeApp();
  try {
    const res = await app.inject({ method: 'GET', url: '/api/config' });
    assert(res.statusCode === 200, 'config: sem IDs configurados -> 200');
    assert(res.json().ok === true, 'config: resposta ok=true');
    assert(Object.keys(res.json().data ?? {}).length === 0, 'config: IDs vazios não são expostos');
  } finally {
    await cleanup(app, dir);
  }
}

{
  const { app, dir } = await makeApp({
    config: { apiPublicUrl: 'https://api.exemplo.com', adsenseId: 'ca-pub-123', ga4Id: 'G-ABC' },
  });
  try {
    const res = await app.inject({ method: 'GET', url: '/api/config' });
    const data = res.json().data;
    assert(res.statusCode === 200, 'config: com IDs -> 200');
    assert(data?.adsenseId === 'ca-pub-123', 'config: adsenseId exposto quando configurado');
    assert(data?.ga4Id === 'G-ABC', 'config: ga4Id exposto quando configurado');
    assert(data?.apiPublicUrl === 'https://api.exemplo.com', 'config: apiPublicUrl exposta quando configurada');
    assert(data?.analyticsId === undefined, 'config: analyticsId omitido quando vazio');
  } finally {
    await cleanup(app, dir);
  }
}

// ---------------------------------------------------------------- /api/process
{
  const registry = new AdapterRegistry();
  registry.register(new FakeAdapter('fake', okProcess, ['.example.com']));

  const { app, dir } = await makeApp({ registry });
  try {
    const ok = await app.inject({
      method: 'POST',
      url: '/api/process',
      payload: { url: 'https://www.example.com/watch?v=1' },
    });
    assert(ok.statusCode === 200, 'process: URL suportada -> 200');
    assert(ok.json().ok === true, 'process: resposta ok=true');
    assert(ok.json().data?.platform === 'FakePlatform', 'process: plataforma retornada');
    assert(ok.json().data?.formats?.length === 2, 'process: formatos não inventados (2 reais)');

    const invalid = await app.inject({
      method: 'POST',
      url: '/api/process',
      payload: { url: 'not-a-url' },
    });
    assert(invalid.statusCode === 400, 'process: URL inválida -> 400');
    assert(invalid.json().error === 'url-invalid', 'process: erro amigável url-invalid');

    const body = await app.inject({ method: 'POST', url: '/api/process', payload: {} });
    assert(body.statusCode === 400, 'process: sem body -> 400');
    assert(body.json().error === 'url-invalid', 'process: body inválido -> url-invalid');

    const unsupported = await app.inject({
      method: 'POST',
      url: '/api/process',
      payload: { url: 'https://8.8.8.8/v' },
    });
    assert(unsupported.statusCode === 400, 'process: plataforma não suportada -> 400');
    assert(unsupported.json().error === 'platform-unsupported', 'process: erro platform-unsupported');

    const ssrf = await app.inject({
      method: 'POST',
      url: '/api/process',
      payload: { url: 'http://169.254.169.254/latest/meta-data' },
    });
    assert(ssrf.statusCode === 400, 'process: IP privado (SSRF) bloqueado -> 400');
    assert(ssrf.json().error === 'url-invalid', 'process: SSRF -> url-invalid (não expõe detalhes)');
  } finally {
    await cleanup(app, dir);
  }
}

// ---------------------------------------------------------------- /api/download
{
  const downloader = async (_url: string, _binary: string, stem: string): Promise<{ filePath: string; extension: string; title: string }> => {
    const filePath = `${stem}.mp4`;
    await writeFile(filePath, Buffer.from('fake-media-bytes'));
    return { filePath, extension: 'mp4', title: 'download' };
  };

  const { app, dir } = await makeApp({ downloader });
  try {
    const ok = await app.inject({
      method: 'GET',
      url: '/api/download?url=https://www.example.com/watch%3Fv%3D1&format=MP4&quality=1080p',
    });
    assert(ok.statusCode === 200, 'download: sucesso -> 200');
    assert(ok.headers['content-type'] === 'video/mp4', `download: Content-Type mp4 (recebeu ${ok.headers['content-type']})`);
    assert(ok.headers['content-length'] === '16', `download: Content-Length do corpo real (recebeu ${ok.headers['content-length']})`);
    assert(ok.body === 'fake-media-bytes', 'download: corpo streamado corretamente');

    const badFormat = await app.inject({
      method: 'GET',
      url: '/api/download?url=https://www.example.com/v&format=AVI&quality=1080p',
    });
    assert(badFormat.statusCode === 400, 'download: formato desconhecido -> 400');

    const badQuality = await app.inject({
      method: 'GET',
      url: '/api/download?url=https://www.example.com/v&format=MP4&quality=abc',
    });
    assert(badQuality.statusCode === 400, 'download: qualidade inválida -> 400');

    const missingUrl = await app.inject({
      method: 'GET',
      url: '/api/download?format=MP3&quality=áudio',
    });
    assert(missingUrl.statusCode === 400, 'download: sem URL -> 400');
  } finally {
    await cleanup(app, dir);
  }
}

// ------------------------------------------------------- semáforo ocupado
{
  const semaphore = new Semaphore(1);
  await semaphore.acquire(100); // ocupa o único slot

  const downloader = async (_url: string, _binary: string, stem: string): Promise<{ filePath: string; extension: string; title: string }> => {
    const filePath = `${stem}.mp4`;
    await writeFile(filePath, Buffer.from('x'));
    return { filePath, extension: 'mp4', title: 'x' };
  };

  const { app, dir } = await makeApp({
    semaphore,
    downloader,
    config: { downloadTimeoutMs: 50 },
  });
  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/download?url=https://www.example.com/v&format=MP4&quality=720p',
    });
    assert(res.statusCode === 503, 'download: semáforo cheio -> 503');
    assert(res.json().error === 'busy', 'download: erro busy');
  } finally {
    semaphore.release();
    await cleanup(app, dir);
  }
}

console.log(process.exitCode ? '\nCom falhas.' : '\nTodos os testes de rotas passaram.');