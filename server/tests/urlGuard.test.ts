import { assertSafeUrl, isValidUrl, isUnsafeIp } from '../src/utils/urlGuard';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    console.error(`FALHOU: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`ok: ${label}`);
  }
}

async function blocked(raw: string, label: string, opts = {}): Promise<void> {
  try {
    await assertSafeUrl(raw, opts);
    assert(false, `${label} (deveria bloquear ${raw})`);
  } catch {
    assert(true, `${label} -> bloqueado`);
  }
}

async function allowed(raw: string, label: string, opts = {}): Promise<void> {
  try {
    await assertSafeUrl(raw, opts);
    assert(true, `${label} -> liberado`);
  } catch {
    assert(false, `${label} (bloqueou indevidamente ${raw})`);
  }
}

/** fetch falso que responde 200 com uma URL final específica (simula redirect). */
function fakeFetchTo(finalUrl: string): typeof fetch {
  return (async () =>
    ({
      url: finalUrl,
      body: { cancel: async () => undefined },
    }) as unknown as Response) as typeof fetch;
}

// ------------------------------------------------------------ isUnsafeIp
assert(isUnsafeIp('127.0.0.1') === true, 'isUnsafeIp: 127.0.0.1');
assert(isUnsafeIp('10.1.2.3') === true, 'isUnsafeIp: 10.x');
assert(isUnsafeIp('172.16.0.1') === true, 'isUnsafeIp: 172.16');
assert(isUnsafeIp('192.168.1.1') === true, 'isUnsafeIp: 192.168');
assert(isUnsafeIp('8.8.8.8') === false, 'isUnsafeIp: 8.8.8.8 publico');
assert(isUnsafeIp('100.64.0.1') === true, 'isUnsafeIp: CGNAT 100.64/10');
assert(isUnsafeIp('192.0.2.10') === true, 'isUnsafeIp: TEST-NET-1 (doc)');
assert(isUnsafeIp('224.0.0.1') === true, 'isUnsafeIp: multicast');

assert(isUnsafeIp('::1') === true, 'isUnsafeIp: ::1 loopback');
assert(isUnsafeIp('::') === true, 'isUnsafeIp: :: indefinido');
assert(isUnsafeIp('fc00::1') === true, 'isUnsafeIp: ULA fc00::/7');
assert(isUnsafeIp('fe80::1') === true, 'isUnsafeIp: link-local fe80::/10');
assert(isUnsafeIp('2001:db8::1') === true, 'isUnsafeIp: doc 2001:db8::/32');
assert(isUnsafeIp('ff02::1') === true, 'isUnsafeIp: multicast ff00::/8');
assert(isUnsafeIp('::ffff:192.168.0.1') === true, 'isUnsafeIp: IPv4-mapped privado');
assert(isUnsafeIp('::ffff:8.8.8.8') === false, 'isUnsafeIp: IPv4-mapped publico');
assert(isUnsafeIp('2606:4700:4700::1111') === false, 'isUnsafeIp: IPv6 publico liberado');

// ------------------------------------------------------------ isValidUrl
assert(isValidUrl('https://www.youtube.com/watch?v=x') === true, 'isValidUrl: https ok');
assert(isValidUrl('http://example.com') === true, 'isValidUrl: http ok');
assert(isValidUrl('ftp://example.com') === false, 'isValidUrl: ftp rejeitado');
assert(isValidUrl('javascript:alert(1)') === false, 'isValidUrl: javascript rejeitado');
assert(isValidUrl('não é uma url') === false, 'isValidUrl: texto rejeitado');

// ----------------------------------------------------- hosts em blacklist
await blocked('http://localhost/', 'hosts: localhost');
await blocked('http://127.0.0.1/', 'hosts: 127.0.0.1');
await blocked('http://metadata.google.internal/', 'hosts: metadata.google.internal');
await blocked('http://169.254.169.254/latest/meta-data', 'hosts: link-local do cloud');

// ----------------------------------------------------- IPv4: faixas especiais
await blocked('http://10.0.0.5/', 'privado: 10.0.0.0/8');
await blocked('http://172.16.0.1/', 'privado: 172.16.0.0/12');
await blocked('http://192.168.1.1/', 'privado: 192.168.0.0/16');
await blocked('http://0.0.0.0/', 'privado: 0.0.0.0/8');
await blocked('http://100.64.0.1/', 'privado: CGNAT 100.64.0.0/10');
await blocked('http://192.0.2.1/', 'privado: TEST-NET-1 doc');
await blocked('http://198.51.100.1/', 'privado: TEST-NET-2 doc');
await blocked('http://203.0.113.1/', 'privado: TEST-NET-3 doc');
await blocked('http://224.0.0.1/', 'privado: multicast');

// ----------------------------------------------------- IPv6
await blocked('http://[::1]/', 'IPv6: ::1 loopback');
await blocked('http://[fc00::1]/', 'IPv6: ULA');
await blocked('http://[fe80::1]/', 'IPv6: link-local');
await blocked('http://[::ffff:192.168.1.1]/', 'IPv6: IPv4-mapped privado');
await blocked('http://[::ffff:10.0.0.1]/', 'IPv6: IPv4-mapped RFC1918');

// ----------------------------------------------------- trailing dot (FQDN)
await blocked('http://localhost./', 'trailing-dot: localhost.');
await blocked('http://127.0.0.1./', 'trailing-dot: 127.0.0.1.');

// ----------------------------------------------------- IP público permite
await allowed('http://8.8.8.8/', 'IP público 8.8.8.8 liberado');
await allowed('http://[2606:4700:4700::1111]/', 'IPv6 público liberado');

// ----------------------------------------------------- protocolo
await blocked('ftp://example.com/file', 'protocolo: ftp bloqueado');
await allowed('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'protocolo: https permitido');

// ----------------------------------------------------- redirects (SSRF)
await blocked(
  'https://example.com/segue',
  'redirect: para link-local bloqueado',
  { followRedirects: true, fetchFn: fakeFetchTo('http://169.254.169.254/latest/meta-data') },
);
await blocked(
  'https://example.com/segue',
  'redirect: para IPv6 loopback bloqueado',
  { followRedirects: true, fetchFn: fakeFetchTo('http://[::1]/') },
);
await blocked(
  'https://example.com/segue',
  'redirect: para RFC1918 bloqueado',
  { followRedirects: true, fetchFn: fakeFetchTo('http://192.168.0.5/') },
);
await blocked(
  'https://example.com/segue',
  'redirect: para hostname privado bloqueado',
  { followRedirects: true, fetchFn: fakeFetchTo('http://localhost/admin') },
);
await allowed(
  'https://example.com/segue',
  'redirect: para IP público permitido',
  { followRedirects: true, fetchFn: fakeFetchTo('https://8.8.8.8/') },
);

console.log(process.exitCode ? '\nCom falhas.' : '\nTodos os testes de urlGuard passaram.');