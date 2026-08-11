export type MediaKind = 'video' | 'audio' | 'image';

/**
 * Formato retornado pelo backend. `kind` diz explicitamente o tipo de mídia
 * (o frontend nunca adivinha), `quality` a qualidade exibida, `ext` a extensão
 * real e `id` o identificador do formato na origem.
 */
export interface MediaFormat {
  id: string;
  kind: MediaKind;
  /** Rótulo de compatibilidade usado na rota de download (MP4 | MP3 | IMAGEM). */
  format: string;
  quality: string;
  ext: string;
  size?: number;
}

export interface MediaInfo {
  title: string;
  platform: string;
  thumbnail?: string;
  duration?: number;
  formats: MediaFormat[];
}

export interface ProcessResult {
  data?: MediaInfo;
  error?: string;
}

export interface PlatformAdapter {
  readonly id: string;
  readonly name: string;
  matches(url: URL): boolean;
  process(url: URL): Promise<ProcessResult>;
}

/**
 * Perfil declarativo de uma plataforma. Permite adicionar novas plataformas
 * registrando apenas um perfil — sem reescrever o processamento.
 */
export interface PlatformProfile {
  readonly id: string;
  readonly label: string;
  readonly hosts: string[];
  readonly extraMatch?: (url: URL) => boolean;
}

export function hostMatches(host: string, list: string[]): boolean {
  const normalized = host.replace(/^www\./, '');
  return list.some((h) => normalized === h || normalized.endsWith(`.${h}`));
}

export const KNOWN_PLATFORMS = [
  'YouTube',
  'Facebook',
  'Instagram',
  'TikTok',
  'Kwai',
  'Pinterest',
  'X',
  'Reddit',
] as const;

export type PlatformName = (typeof KNOWN_PLATFORMS)[number];