import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Log JSONL de operações, sem dados sensíveis.
 * IP é anonimizado (último octeto substituído) para reduzir rastreio.
 */
export class Logger {
  private readonly file: string;

  constructor(logDir: string) {
    this.file = path.join(logDir, 'app.log');
  }

  private async ensureDir(): Promise<void> {
    await mkdir(path.dirname(this.file), { recursive: true });
  }

  anonymizeIp(ip: string): string {
    if (!ip) return 'unknown';
    const trimmed = ip.replace(/^::ffff:/, '');
    if (trimmed.includes(':')) {
      return `${trimmed.split(':').slice(0, 4).join(':')}:...`;
    }
    const parts = trimmed.split('.');
    if (parts.length === 4) {
      parts[3] = 'x';
      return parts.join('.');
    }
    return 'invalid';
  }

  async log(entry: {
    ts: string;
    endpoint: string;
    platform?: string;
    status: number | string;
    durationMs: number;
    ip?: string;
    error?: string;
    [key: string]: unknown;
  }): Promise<void> {
    try {
      await this.ensureDir();
      const record = {
        ...entry,
        ip: entry.ip ? this.anonymizeIp(entry.ip) : undefined,
      };
      await appendFile(this.file, `${JSON.stringify(record)}\n`, 'utf8');
    } catch {
      // Logging nunca deve interromper a operação principal.
    }
  }
}