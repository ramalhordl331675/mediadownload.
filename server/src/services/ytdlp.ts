import { execFile } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);

interface YtDlpArgs {
  timeoutMs: number;
  maxBytes: number;
}

interface Entry {
  id: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  url?: string;
  filesize?: number;
  filesize_approx?: number;
  formats?: Array<{
    format_id: string;
    ext: string;
    height?: number;
    filesize?: number;
    filesize_approx?: number;
    url?: string;
  }>;
}

export interface MediaFormatOut {
  id: string;
  kind: 'video' | 'audio' | 'image';
  format: string;
  quality: string;
  ext: string;
  size?: number;
}

export interface DownloadOut {
  filePath: string;
  extension: string;
  title: string;
}

/** Normaliza o binário do yt-dlp (paths com barras duplas do Windows). */
function normalizeBinary(binary: string): string {
  if (!binary) return 'yt-dlp';
  return binary.replace(/\\/g, '/');
}

/** Extrai a extensão real de uma URL de mídia (fallback seguro). */
function extFromUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  const match = /\.([a-z0-9]{2,5})(?:[?#]|$)/i.exec(url);
  return match ? match[1].toLowerCase() : fallback;
}

/** Constrói a lista de formatos a partir do dump de metadados do yt-dlp. */
export function buildYtDlpArgs(entry: Entry): MediaFormatOut[] {
  const formats = entry.formats ?? [];
  const audio = formats.find((f) => f.format_id?.toLowerCase().startsWith('251'));
  const videos = formats
    .filter((f) => Number.isFinite(f.height))
    .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
    .filter((f, i, all) => all.findIndex((g) => g.height === f.height) === i)
    .slice(0, 4);

  const out: MediaFormatOut[] = [];

  for (const v of videos) {
    out.push({
      id: v.format_id ?? `${v.height}p`,
      kind: 'video',
      format: 'MP4',
      quality: `${v.height}p`,
      ext: (v.ext || extFromUrl(v.url, 'mp4')).toLowerCase(),
      size: v.filesize ?? v.filesize_approx,
    });
  }

  if (audio?.url) {
    out.push({
      id: audio.format_id ?? 'mp3',
      kind: 'audio',
      format: 'MP3',
      quality: 'áudio',
      ext: 'mp3',
      size: audio.filesize ?? audio.filesize_approx,
    });
  }

  return out;
}

/**
 * Converte um entry do yt-dlp na lista final de formatos.
 * Conteúdo não-vídeo (ex.: imagens) sem formatos expõe o arquivo original.
 */
export function toMediaFormats(entry: Entry): MediaFormatOut[] {
  const formats = buildYtDlpArgs(entry);
  if (formats.length === 0 && entry.url) {
    formats.push({
      id: entry.id ?? 'original',
      kind: 'image',
      format: 'IMAGEM',
      quality: 'Original',
      ext: extFromUrl(entry.url, 'jpg'),
      size: entry.filesize ?? entry.filesize_approx,
    });
  }
  return formats;
}

export async function extractMetadata(url: string, binary: string, opts: YtDlpArgs): Promise<Entry> {
  const { stdout } = await execFileAsync(
    normalizeBinary(binary),
    ['--skip-download', '--dump-json', '--no-warnings', '--', url],
    { timeout: opts.timeoutMs, maxBuffer: opts.maxBytes, windowsHide: true },
  );

  return JSON.parse(stdout) as Entry;
}

/**
 * Seleção de formato compatível com os botões da interface.
 * Prioriza vídeo+áudio separados na maior resolução disponível, com fallback
 * conservador apenas para plataformas sem streams separados.
 */
export function formatSelector(format: string, quality: string): string {
  if (format === 'MP3') {
    return 'bestaudio/best';
  }
  if (format === 'IMAGEM') {
    return 'best';
  }
  if (quality === 'Melhor') {
    return 'bestvideo+bestaudio/best';
  }
  const height = Number.parseInt(quality, 10);
  const h = Number.isFinite(height) && height > 0 ? height : 1080;
  return `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]/best[height<=${h}]`;
}

/**
 * Baixa a mídia para o disco usando yt-dlp.
 * O arquivo é gravado em `stem.<ext>`; a extensão real é resolvida após o término.
 */
export async function downloadMedia(
  url: string,
  binary: string,
  stem: string,
  opts: YtDlpArgs & { format: string; quality: string },
): Promise<DownloadOut> {
  const binaryPath = normalizeBinary(binary);
  const args = [
    '--no-warnings',
    '--no-progress',
    '--no-part',
    '--merge-output-format',
    'mkv',
    '-f',
    formatSelector(opts.format, opts.quality),
  ];

  if (opts.format === 'MP3') {
    args.push('--extract-audio', '--audio-format', 'mp3', '--audio-quality', '0');
  }

  args.push('-o', `${stem.replace(/\\/g, '/')}.%(ext)s`, '--', url);

  await execFileAsync(binaryPath, args, {
    timeout: opts.timeoutMs,
    maxBuffer: opts.maxBytes,
    windowsHide: true,
  });

  const dir = path.dirname(stem);
  const base = path.basename(stem);
  const entries = await readdir(dir);
  const target = entries.find((name) => name.startsWith(base));

  if (!target) {
    throw new Error('no-output-file');
  }

  return {
    filePath: path.join(dir, target),
    extension: path.extname(target).replace(/^\./, '').toLowerCase(),
    title: base,
  };
}