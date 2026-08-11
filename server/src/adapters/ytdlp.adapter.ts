import type { PlatformAdapter } from './types';
import type { EnvConfig } from '../config';
import type { ProcessResult, PlatformProfile } from './types';
import { extractMetadata, toMediaFormats } from '../services/ytdlp';
import { classifyYtDlpFailure } from '../utils/ytdlpErrors';
import { ErrorCodes } from '../errors';

/**
 * Adapter genérico orientado por perfil declarativo.
 * Cada plataforma registra um PlatformProfile; a extração real é feita pelo yt-dlp.
 */
export class YtDlpAdapter implements PlatformAdapter {
  readonly id: string;
  readonly name: string;

  constructor(
    private readonly config: EnvConfig,
    private readonly profile: PlatformProfile,
  ) {
    this.id = profile.id;
    this.name = profile.label;
  }

  matches(url: URL): boolean {
    if (this.profile.extraMatch?.(url)) {
      return true;
    }
    return this.profile.hosts.some((h) => {
      const host = url.hostname;
      return host === h || host.endsWith(`.${h}`);
    });
  }

  async process(url: URL): Promise<ProcessResult> {
    let entry;
    try {
      entry = await extractMetadata(url.toString(), this.config.ytDlpPath, {
        timeoutMs: this.config.processTimeoutMs,
        maxBytes: this.config.maxResponseBytes,
      });
    } catch (err) {
      const code = classifyYtDlpFailure(err);
      return { error: code ?? ErrorCodes.PROCESS_FAILED };
    }

    const formats = toMediaFormats(entry);

    return {
      data: {
        title: entry.title ?? this.profile.label,
        platform: this.profile.label,
        thumbnail: entry.thumbnail,
        duration: entry.duration,
        formats,
      },
    };
  }
}