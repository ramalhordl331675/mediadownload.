import { ErrorCodes } from '../errors';

/**
 * Classifica falhas do yt-dlp em códigos amigáveis sem expor mensagens técnicas.
 * Detecta sinais claros de conteúdo privado/restrito; o restante vira process-failed.
 */
const PRIVATE_PATTERNS: RegExp[] = [
  /\bprivate\b/i,
  /\bsign in\b/i,
  /\bsign-in\b/i,
  /\blog\s?in\b/i,
  /\blogin required/i,
  /requires (an account|authentication|login)/i,
  /\bmembers[- ]only\b/i,
  /\bsubscribers[- ]only\b/i,
  /\bpaid (membership|video|content)\b/i,
  /\bgated content\b/i,
  /\bnon[- ]public\b/i,
  /\bnot available in your country\b/i,
  /\bregion[- ]?locked\b/i,
  /\bcookies are required\b/i,
];

export function classifyYtDlpFailure(err: unknown): string | undefined {
  const raw = (err as { stderr?: string | Buffer })?.stderr;
  const stderr = Buffer.isBuffer(raw) ? raw.toString('utf8') : (raw ?? '');
  const message = err instanceof Error ? err.message : '';
  const haystack = `${stderr}\n${message}`;

  if (PRIVATE_PATTERNS.some((re) => re.test(haystack))) {
    return ErrorCodes.CONTENT_PRIVATE;
  }

  return undefined;
}