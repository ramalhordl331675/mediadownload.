import { lookup } from 'node:dns/promises';

// Lista de domínios que o servidor jamais deve acessar diretamente.
export const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '[::1]',
  '0.0.0.0',
  'metadata.google.internal',
  '169.254.169.254',
]);

export type FetchFn = typeof fetch;

export interface UrlGuardOptions {
  /** Segue redirects HTTP e valida o destino final (anti-SSRF por redirect). */
  followRedirects?: boolean;
  /** Função usada para seguir redirects (injetável em testes). */
  fetchFn?: FetchFn;
  /** Timeout máximo da checagem de redirects. */
  redirectTimeoutMs?: number;
}

// ---------------------------------------------------------------------------
// IPv4
// ---------------------------------------------------------------------------

/** Converte "a.b.c.d" em um número inteiro sem sinal; null se inválido. */
function ipv4ToNumber(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n > 255) return null;
    value = (value << 8) | n;
  }
  return value >>> 0;
}

/** Faixa IPv4 [início, fim] a partir de "a.b.c.d/bits". */
function makeRange(dotted: string, bits: number): [number, number] {
  const base = ipv4ToNumber(dotted);
  if (base === null) {
    throw new Error(`faixa IPv4 inválida: ${dotted}/${bits}`);
  }
  const mask = bits === 0 ? 0xffffffff : (1 << (32 - bits)) - 1;
  return [(base & ~mask) >>> 0, (base | mask) >>> 0];
}

const IPV4_RANGES: Array<[number, number]> = [
  makeRange('0.0.0.0', 8), // 0.0.0.0/8 (this host / "this network")
  makeRange('10.0.0.0', 8), // RFC1918
  makeRange('100.64.0.0', 10), // CGNAT (RFC 6598)
  makeRange('127.0.0.0', 8), // loopback
  makeRange('169.254.0.0', 16), // link-local
  makeRange('172.16.0.0', 12), // RFC1918
  makeRange('192.0.0.0', 24), // IETF protocol assignments
  makeRange('192.0.2.0', 24), // TEST-NET-1 (documentação)
  makeRange('192.168.0.0', 16), // RFC1918
  makeRange('192.88.99.0', 24), // 6to4 relay (deprecado)
  makeRange('198.18.0.0', 15), // benchmark
  makeRange('198.51.100.0', 24), // TEST-NET-2 (documentação)
  makeRange('203.0.113.0', 24), // TEST-NET-3 (documentação)
  makeRange('224.0.0.0', 4), // multicast
  makeRange('240.0.0.0', 4), // reservado
];

export function isUnsafeIpv4(ip: string): boolean {
  const value = ipv4ToNumber(ip);
  if (value === null) return true;
  return IPV4_RANGES.some(([start, end]) => value >= start && value <= end);
}

// ---------------------------------------------------------------------------
// IPv6
// ---------------------------------------------------------------------------

function hexGroupToNum(group: string): number | null {
  if (!/^[0-9a-fA-F]{1,4}$/.test(group)) return null;
  return Number.parseInt(group, 16);
}

/** Converte um endereço IPv6 (com ou sem colchetes, com ou sem %zone) em bigint. */
export function ipv6ToBigInt(input: string): bigint | null {
  let raw = input.trim();
  if (raw.startsWith('[') && raw.endsWith(']')) raw = raw.slice(1, -1);
  const zone = raw.indexOf('%');
  if (zone !== -1) raw = raw.slice(0, zone);
  if (!raw.includes(':')) return null;

  // IPv4-mapped: translate a cauda "a.b.c.d" em dois grupos hex.
  const v4Tail = /^(.*):(\d{1,3}(?:\.\d{1,3}){3})$/.exec(raw);
  if (v4Tail) {
    const v4 = ipv4ToNumber(v4Tail[2]);
    if (v4 === null) return null;
    raw = `${v4Tail[1]}:${((v4 >>> 16) & 0xffff).toString(16)}:${(v4 & 0xffff).toString(16)}`;
  }

  const parts = raw.split('::');
  if (parts.length > 2) return null;

  const left = parts[0] ? parts[0].split(':') : [];
  const right = parts.length === 2 && parts[1] ? parts[1].split(':') : [];

  if (left.length + right.length > 8) return null;

  const groups: number[] = [];
  for (const g of left) {
    const n = hexGroupToNum(g);
    if (n === null) return null;
    groups.push(n);
  }

  if (parts.length === 2) {
    const pad = 8 - (left.length + right.length);
    for (let i = 0; i < pad; i++) groups.push(0);
  }

  for (const g of right) {
    const n = hexGroupToNum(g);
    if (n === null) return null;
    groups.push(n);
  }

  if (groups.length !== 8) return null;

  let value = 0n;
  for (const g of groups) value = (value << 16n) | BigInt(g);
  return value;
}

function v6Range(prefix: bigint, bits: number): [bigint, bigint] {
  const mask = bits === 0 ? 0n : (1n << (128n - BigInt(bits))) - 1n;
  return [prefix & ~mask, (prefix | mask)];
}

const IPV6_RANGES: Array<[bigint, bigint]> = [
  v6Range(0n, 128), // ::
  v6Range(1n, 128), // ::1 (loopback)
  v6Range(0xfc00n << 112n, 7), // fc00::/7 (ULA)
  v6Range(0xfe80n << 112n, 10), // fe80::/10 (link-local)
  v6Range(0xfec0n << 112n, 10), // fec0::/10 (site-local, deprecado)
  v6Range(0x20010db8n << 96n, 32), // 2001:db8::/32 (documentação)
  v6Range(0xff00n << 112n, 8), // ff00::/8 (multicast)
];

function isUnsafeIpv6(input: string): boolean {
  const value = ipv6ToBigInt(input);
  if (value === null) return true;

  if (IPV6_RANGES.some(([start, end]) => value >= start && value <= end)) return true;

  // ::ffff:0:0/96 — IPv4-mapped: valida o IPv4 embutido contra as faixas v4.
  if (value >> 32n === 0xffffn) {
    const mapped = value & 0xffffffffn;
    return IPV4_RANGES.some(([start, end]) => mapped >= BigInt(start) && mapped <= BigInt(end));
  }

  return false;
}

export function isUnsafeIp(ip: string): boolean {
  if (!ip) return true;
  const trimmed = ip.trim();
  if (trimmed.includes(':')) return isUnsafeIpv6(trimmed);
  return isUnsafeIpv4(trimmed);
}

// ---------------------------------------------------------------------------
// URL
// ---------------------------------------------------------------------------

export function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Normaliza hostname: minúsculas, sem ponto final (FQDN trailing dot) e sem colchetes. */
function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/\.$/, '').replace(/^\[/, '').replace(/\]$/, '');
}

function isIpLiteral(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');
}

async function validateHostOnly(url: URL): Promise<URL> {
  const host = normalizeHost(url.hostname);
  if (BLOCKED_HOSTS.has(host) || BLOCKED_HOSTS.has(`[${host}]`)) {
    throw new Error('blocked-host');
  }

  // IP literal (v4 ou v6): sem resolução DNS.
  if (isIpLiteral(host)) {
    if (isUnsafeIp(host)) throw new Error('blocked-host');
    return url;
  }

  // Resolução DNS: rejeita A/AAAA (e IPv4-mapped) privados.
  try {
    const records = await lookup(host, { all: true });
    if (records.some((r) => isUnsafeIp(r.address))) {
      throw new Error('blocked-host');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'blocked-host') {
      throw err;
    }
    // Falha de DNS genérica fica para o processador decidir como erro amigável.
    throw new Error('dns-failed');
  }

  return url;
}

/** Segue redirects e devolve a URL final sem baixar o corpo. */
async function resolveRedirects(
  url: string,
  opts: UrlGuardOptions,
): Promise<URL | null> {
  const fetcher = opts.fetchFn ?? fetch;
  try {
    const res = await fetcher(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(opts.redirectTimeoutMs ?? 8000),
    });
    const final = new URL(res.url || url);
    // Não baixa o corpo: apenas valida o destino.
    await res.body?.cancel();
    return final;
  } catch {
    // Rede indisponível/indisponibilidade do destino: quem decide é o yt-dlp.
    return null;
  }
}

/**
 * Impede SSRF: bloqueia hosts suspeitos, IPs privados (v4/v6), faixas de
 * documentação/CGNAT e redirects para destinos internos, antes de qualquer
 * requisição externa ser feita pelo servidor.
 */
export async function assertSafeUrl(raw: string, opts: UrlGuardOptions = {}): Promise<URL> {
  const url = new URL(raw);

  if (!url.protocol.startsWith('http')) {
    throw new Error('unsupported-protocol');
  }

  await validateHostOnly(url);

  // Redirect para IP/host interno seria um vetor de SSRF.
  if (opts.followRedirects !== false) {
    const final = await resolveRedirects(url.toString(), opts);
    if (final) {
      await validateHostOnly(final);
    }
  }

  return url;
}