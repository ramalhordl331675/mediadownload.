import type { PlatformAdapter } from './types';

export class AdapterRegistry {
  private readonly adapters: PlatformAdapter[] = [];

  register(adapter: PlatformAdapter): this {
    this.adapters.push(adapter);
    return this;
  }

  resolve(url: URL): PlatformAdapter | undefined {
    return this.adapters.find((adapter) => adapter.matches(url));
  }
}