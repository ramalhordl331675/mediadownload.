import { createReadStream } from 'node:fs';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { EnvConfig } from '../config';
import { ErrorCodes } from '../errors';
import type { Semaphore } from '../services/semaphore';
import type { TempFiles } from '../services/tempFiles';
import type { Logger } from '../services/logs';
import { downloadMedia } from '../services/ytdlp';
import { assertSafeUrl, isValidUrl } from '../utils/urlGuard';

const downloadQuery = z.object({
  url: z.string().trim().min(1).max(2048),
  format: z.enum(['MP4', 'MP3', 'IMAGEM']),
  quality: z.string().trim().min(1).max(12),
});

const MIME_BY_EXT: Record<string, string> = {
  mp4: 'video/mp4',
  m4a: 'audio/mp4',
  mp3: 'audio/mpeg',
  webm: 'video/webm',
  mkv: 'video/x-matroska',
  ogg: 'audio/ogg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  mov: 'video/quicktime',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

export type Downloader = typeof downloadMedia;

interface DownloadDeps {
  config: EnvConfig;
  semaphore: Semaphore;
  tempFiles: TempFiles;
  logger: Logger;
  downloader?: Downloader;
}

export function downloadRoutes(app: FastifyInstance, deps: DownloadDeps): void {
  app.get('/api/download', async (req: FastifyRequest, reply: FastifyReply) => {
    const started = Date.now();

    const log = async (status: number, extra: Record<string, unknown> = {}): Promise<void> => {
      await deps.logger.log({
        ts: new Date().toISOString(),
        endpoint: '/api/download',
        status,
        durationMs: Date.now() - started,
        ip: req.ip,
        ...extra,
      });
    };

    const parsed = downloadQuery.safeParse(req.query);
    if (!parsed.success) {
      await log(400, { error: ErrorCodes.URL_INVALID });
      return reply.status(400).send({ ok: false, error: ErrorCodes.URL_INVALID });
    }

    const { url, format, quality } = parsed.data;

    if (!isValidUrl(url)) {
      await log(400, { error: ErrorCodes.URL_INVALID });
      return reply.status(400).send({ ok: false, error: ErrorCodes.URL_INVALID });
    }

    let safeUrl: URL;
    try {
      safeUrl = await assertSafeUrl(url, {
        followRedirects: deps.config.ssrfFollowRedirects,
        redirectTimeoutMs: deps.config.ssrfRedirectTimeoutMs,
      });
    } catch {
      await log(400, { error: ErrorCodes.URL_INVALID });
      return reply.status(400).send({ ok: false, error: ErrorCodes.URL_INVALID });
    }

    if (format === 'MP4' && !/^\d{2,4}p$/.test(quality) && quality !== 'Melhor') {
      await log(400, { error: ErrorCodes.DOWNLOAD_FAILED });
      return reply.status(400).send({ ok: false, error: ErrorCodes.DOWNLOAD_FAILED });
    }
    if (format === 'IMAGEM' && quality !== 'Original') {
      await log(400, { error: ErrorCodes.DOWNLOAD_FAILED });
      return reply.status(400).send({ ok: false, error: ErrorCodes.DOWNLOAD_FAILED });
    }

    const acquired = await deps.semaphore.acquire(deps.config.downloadTimeoutMs);
    if (!acquired) {
      await log(503, { error: ErrorCodes.BUSY });
      return reply.status(503).send({ ok: false, error: ErrorCodes.BUSY });
    }

    const stem = deps.tempFiles.newDownloadStem();

    try {
      const downloaded = await (deps.downloader ?? downloadMedia)(safeUrl.toString(), deps.config.ytDlpPath, stem, {
        format,
        quality,
        timeoutMs: deps.config.downloadTimeoutMs,
        maxBytes: deps.config.maxResponseBytes,
      });

      const size = await deps.tempFiles.size(downloaded.filePath);
      if (size === 0) {
        throw new Error('empty-file');
      }
      if (size > deps.config.maxResponseBytes) {
        throw new Error('too-large');
      }

      deps.semaphore.release();

      const mime = MIME_BY_EXT[downloaded.extension] ?? 'application/octet-stream';
      const filename = `media_${Date.now()}.${downloaded.extension}`;

      await log(200, { format, quality, size, mime });

      reply
        .header('Content-Type', mime)
        .header('Content-Length', String(size))
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .header('Cache-Control', 'no-store');

      const stream = createReadStream(downloaded.filePath);
      stream.on('close', () => {
        void deps.tempFiles.remove(downloaded.filePath);
      });
      stream.on('error', () => {
        void deps.tempFiles.remove(downloaded.filePath);
      });

      return reply.send(stream);
    } catch (err) {
      deps.semaphore.release();
      const message = err instanceof Error ? err.message : '';
      const stderr = err instanceof Error && err.stack ? err.stack : '';
      const tooLarge = message === 'too-large';
      const code = tooLarge ? ErrorCodes.TOO_LARGE : ErrorCodes.DOWNLOAD_FAILED;
      const status = tooLarge ? 413 : 400;

      await log(status, { error: code, detail: `${message} :: ${stderr}`.slice(0, 600) });
      void deps.tempFiles.remove(stem);

      return reply.status(status).send({ ok: false, error: code });
    }
  });
}