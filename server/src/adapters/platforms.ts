import type { EnvConfig } from '../config';
import type { AdapterRegistry } from './registry';
import type { PlatformProfile } from './types';
import { YtDlpAdapter } from './ytdlp.adapter';

/**
 * Perfis declarativos das plataformas suportadas.
 * Para adicionar uma plataforma: inclua um perfil aqui (e, se necessário,
 * um extraMatch para atalhos de URL) — o registro é automático.
 */
export const PLATFORM_PROFILES: PlatformProfile[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    hosts: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    hosts: ['facebook.com', 'fb.watch'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    hosts: ['instagram.com'],
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    hosts: ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'],
  },
  {
    id: 'kwai',
    label: 'Kwai',
    hosts: ['kwai.com', 'kwai-video.com'],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    hosts: ['pinterest.com', 'pin.it'],
    extraMatch: (url) => /(^|\.)pinterest\./.test(url.hostname),
  },
  {
    id: 'x',
    label: 'X',
    hosts: ['x.com', 'twitter.com'],
  },
  {
    id: 'reddit',
    label: 'Reddit',
    hosts: ['reddit.com', 'redd.it'],
  },
];

export function registerPlatforms(registry: AdapterRegistry, config: EnvConfig): void {
  for (const profile of PLATFORM_PROFILES) {
    registry.register(new YtDlpAdapter(config, profile));
  }
}