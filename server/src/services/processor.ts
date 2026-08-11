import type { AdapterRegistry } from '../adapters/registry';
import type { ProcessResult } from '../adapters/types';
import { assertSafeUrl, isValidUrl, type UrlGuardOptions } from '../utils/urlGuard';

export class Processor {
  constructor(
    private readonly registry: AdapterRegistry,
    private readonly urlGuardOptions: UrlGuardOptions = {},
  ) {}

  async process(rawUrl: string): Promise<ProcessResult> {
    if (!isValidUrl(rawUrl)) {
      return { error: 'url-invalid' };
    }

    let url: URL;
    try {
      url = await assertSafeUrl(rawUrl, this.urlGuardOptions);
    } catch {
      return { error: 'url-invalid' };
    }

    const adapter = this.registry.resolve(url);
    if (!adapter) {
      return { error: 'platform-unsupported' };
    }

    try {
      const result = await adapter.process(url);
      if (!result.data && !result.error) {
        return { error: 'process-failed' };
      }
      return result;
    } catch {
      return { error: 'process-failed' };
    }
  }
}