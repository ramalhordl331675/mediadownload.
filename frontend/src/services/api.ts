export type FormatKind = 'video' | 'audio' | 'image';

export interface FormatInfo {
  id: string;
  kind: FormatKind;
  format: string;
  quality: string;
  ext: string;
  size?: number;
}

export interface ProcessResponse {
  ok: boolean;
  error?: string;
  data?: {
    title: string;
    platform: string;
    thumbnail?: string;
    duration?: number;
    formats: FormatInfo[];
  };
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number) {
    super(`api-error:${code}`);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// Base da API. Vazia => requisições no mesmo domínio (deploy de peça única).
const envBase = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
const base = envBase.replace(/\/+$/, '');

/** Monta uma URL da API com base opcional em outro domínio (VITE_API_URL). */
function withBase(path: string, params?: Record<string, string>): string {
  const url = `${base}${path}`;
  const qs = params ? new URLSearchParams(params).toString() : '';
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(withBase(path), {
    headers: { 'content-type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    let error = 'request-failed';
    try {
      const body = (await res.json()) as { error?: string };
      if (typeof body?.error === 'string' && body.error) {
        error = body.error;
      }
    } catch {
      // corpo não-JSON: mantém o código genérico
    }
    throw new ApiError(error, res.status);
  }

  return (await res.json()) as T;
}

export function processUrl(url: string): Promise<ProcessResponse> {
  return request<ProcessResponse>('/api/process', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export interface PublicConfig {
  apiPublicUrl?: string;
  adsenseId?: string;
  ga4Id?: string;
  analyticsId?: string;
}

export interface ConfigResponse {
  ok: boolean;
  data: PublicConfig;
}

/** Configuração pública do servidor (monetização/analytics habilitadas pelo proprietário). */
export function fetchConfig(): Promise<ConfigResponse> {
  return request<ConfigResponse>('/api/config');
}

/** Gera a URL de download servida pelo backend (streaming + cleanup automático). */
export function buildDownloadUrl(sourceUrl: string, format: string, quality: string): string {
  return withBase('/api/download', { url: sourceUrl, format, quality });
}