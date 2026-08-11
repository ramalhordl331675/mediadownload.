import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export interface ContactMessage {
  ts: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  ip?: string;
}

/**
 * Armazena mensagens de contato em logs/contact.jsonl para o painel administrativo.
 * Não coleta nem persiste dados além dos informados no formulário.
 */
export class MessageStore {
  private readonly file: string;

  constructor(logDir: string) {
    this.file = path.join(logDir, 'contact.jsonl');
  }

  async append(message: ContactMessage): Promise<void> {
    await mkdir(path.dirname(this.file), { recursive: true });
    await appendFile(this.file, `${JSON.stringify(message)}\n`, 'utf8');
  }
}