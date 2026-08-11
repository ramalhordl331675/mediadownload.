export class Semaphore {
  private permits: number;
  private waiters: Array<() => void> = [];

  constructor(private readonly max: number) {
    this.permits = max;
  }

  get active(): number {
    return this.max - this.permits;
  }

  get available(): boolean {
    return this.permits > 0;
  }

  async acquire(timeoutMs: number): Promise<boolean> {
    if (this.permits > 0) {
      this.permits -= 1;
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        const index = this.waiters.indexOf(release);
        if (index >= 0) {
          this.waiters.splice(index, 1);
        }
        resolve(false);
      }, timeoutMs);

      const release = (): void => {
        clearTimeout(timer);
        resolve(true);
      };

      this.waiters.push(release);
    });
  }

  release(): void {
    const next = this.waiters.shift();
    if (next) {
      // A permissão é transferida diretamente para quem esperava.
      next();
    } else {
      this.permits = Math.min(this.permits + 1, this.max);
    }
  }
}