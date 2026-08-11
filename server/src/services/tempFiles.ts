import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

/**
 * Gerenciador de arquivos temporários e diretórios de trabalho.
 * Remove automaticamente arquivos mais velhos que o TTL configurado.
 */
export class TempFiles {
  constructor(
    private readonly tempDir: string,
    private readonly downloadDir: string,
    private readonly ttlMs: number,
  ) {}

  async init(): Promise<void> {
    await Promise.all([
      mkdir(this.tempDir, { recursive: true }),
      mkdir(this.downloadDir, { recursive: true }),
    ]);
  }

  /** Retorna o caminho base (sem extensão) de um arquivo de download único. */
  newDownloadStem(): string {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return path.join(this.downloadDir, `dl-${unique}`);
  }

  async remove(filePath: string): Promise<void> {
    try {
      await rm(filePath, { force: true });
    } catch {
      // remoção é best-effort
    }
  }

  async size(filePath: string): Promise<number> {
    try {
      return (await stat(filePath)).size;
    } catch {
      return 0;
    }
  }

  /** Remove arquivos em `dir` cuja última modificação passou do TTL. */
  async sweep(dir: string): Promise<number> {
    let removed = 0;
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      const now = Date.now();
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        try {
          const meta = await stat(full);
          if (meta.isFile() && now - meta.mtimeMs > this.ttlMs) {
            await rm(full, { force: true });
            removed += 1;
          }
        } catch {
          // arquivo já removido ou inacessível — ignora
        }
      }
    } catch {
      // diretório não existe ainda — ignora
    }
    return removed;
  }

  async sweepAll(): Promise<void> {
    await this.sweep(this.tempDir);
    await this.sweep(this.downloadDir);
  }
}