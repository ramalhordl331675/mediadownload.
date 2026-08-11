export interface EnvConfig {
  port: number;
  corsOrigin: string;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  processTimeoutMs: number;
  downloadTimeoutMs: number;
  maxResponseBytes: number;
  maxConcurrent: number;
  tempDir: string;
  downloadDir: string;
  logDir: string;
  tempFileTtlMs: number;
  ytDlpPath: string;
  ssrfFollowRedirects: boolean;
  ssrfRedirectTimeoutMs: number;
  /** Caminho do frontend estático construído. Vazio = não servir (API apenas). */
  frontendDist: string;
  /** URL pública e config de monetização/analytics. Vazios = desativados. */
  apiPublicUrl: string;
  analyticsId: string;
  adsenseId: string;
  ga4Id: string;
}

function readEnv(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

function readInt(name: string, fallback: number): number {
  const value = Number.parseInt(readEnv(name), 10);
  return Number.isFinite(value) ? value : fallback;
}

function readBool(name: string, fallback: boolean): boolean {
  const value = readEnv(name, '');
  if (value === '') return fallback;
  return !/^(0|false|no|off)$/i.test(value);
}

export function loadConfig(): EnvConfig {
  return {
    port: readInt('PORT', 3000),
    corsOrigin: readEnv('CORS_ORIGIN', 'http://localhost:5173'),
    rateLimitMax: readInt('RATE_LIMIT_MAX', 20),
    rateLimitWindowMs: readInt('RATE_LIMIT_WINDOW_MS', 60_000),
    processTimeoutMs: readInt('PROCESS_TIMEOUT_MS', 60_000),
    downloadTimeoutMs: readInt('DOWNLOAD_TIMEOUT_MS', 900_000),
    maxResponseBytes: readInt('MAX_RESPONSE_BYTES', 524_288_000),
    maxConcurrent: readInt('MAX_CONCURRENT', 2),
    tempDir: readEnv('TEMP_DIR', 'temp'),
    downloadDir: readEnv('DOWNLOAD_DIR', 'downloads'),
    logDir: readEnv('LOG_DIR', 'logs'),
    tempFileTtlMs: readInt('TEMP_FILE_TTL_MS', 3_600_000),
    ytDlpPath: readEnv('YT_DLP_PATH', ''),
    ssrfFollowRedirects: readBool('SSRF_FOLLOW_REDIRECTS', true),
    ssrfRedirectTimeoutMs: readInt('SSRF_REDIRECT_TIMEOUT_MS', 8000),
    frontendDist: readEnv('FRONTEND_DIST', ''),
    apiPublicUrl: readEnv('API_PUBLIC_URL', ''),
    analyticsId: readEnv('ANALYTICS_ID', ''),
    adsenseId: readEnv('ADSENSE_ID', ''),
    ga4Id: readEnv('GA4_ID', ''),
  };
}