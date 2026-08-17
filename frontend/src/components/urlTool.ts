import { buildDownloadUrl, processUrl, ApiError } from '../services/api';
import type { FormatKind, FormatInfo } from '../services/api';
import { escapeHtml } from '../utils/html';
import { t } from '../services/i18n';

interface ResultData {
  title: string;
  platform: string;
  thumbnail?: string;
  duration?: number;
  formats: FormatInfo[];
}

// Demonstração visual de resultado. Nenhum conteúdo real é gerado.
const DEMO: ResultData = {
  title: 'Exemplo de vídeo (demonstração visual)',
  platform: 'YouTube',
  duration: 185,
  formats: [
    { id: 'd1440', kind: 'video', format: 'MP4', quality: '1440p', ext: 'mp4', size: 120 * 1024 * 1024 },
    { id: 'd1080', kind: 'video', format: 'MP4', quality: '1080p', ext: 'mp4', size: 24 * 1024 * 1024 },
    { id: 'd720', kind: 'video', format: 'MP4', quality: '720p', ext: 'mp4', size: 12 * 1024 * 1024 },
    { id: 'dmp3', kind: 'audio', format: 'MP3', quality: 'áudio', ext: 'mp3', size: 5 * 1024 * 1024 },
  ],
};

const EXAMPLE_URLS = [
  { label: 'YouTube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@video/video/123456789012' },
  { label: 'Instagram', url: 'https://www.instagram.com/reel/CxYz/' },
];

function formatBytes(bytes: number | undefined): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  return `${t('result.sizeApprox')} ${Math.round(bytes / (1024 * 1024))} MB`;
}

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function urlToolTemplate(): string {
  return `
    <section class="hero" id="ferramenta" aria-label="Ferramenta de download">
      <div class="container">
        <span class="hero-badge" aria-hidden="true" data-i18n="hero.badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1 3 4.6V18a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4v-2a3 3 0 0 0-6-2.6A3 3 0 0 0 6 12v2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-2.4A5 5 0 0 1 7 8V7a5 5 0 0 1 5-5z"/></svg>
          Download simplificado
        </span>

        <h1><span data-i18n="hero.title">Cole. Processe.</span> <span class="accent" data-i18n="hero.titleAccent">Baixe.</span></h1>
        <p class="hero-sub" data-i18n="hero.sub">Cole uma URL pública, processe o conteúdo e escolha uma opção disponível para download.</p>

        <div class="url-tool" id="url-tool">
          <div class="url-panel" id="url-panel">
            <span class="url-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></svg>
            </span>
            <form class="url-form" id="url-form" role="search" aria-label="Processar URL" novalidate>
              <label class="sr-only" for="url-input">Cole a URL pública do conteúdo</label>
              <input
                class="url-input"
                id="url-input"
                name="url"
                type="url"
                inputmode="url"
                placeholder="Cole aqui a URL"
                data-i18n-placeholder="hero.placeholder"
                autocomplete="off"
                spellcheck="false"
                required
              />
              <div class="url-actions">
                <button class="btn btn-ghost btn-paste" id="paste-btn" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Colar
                </button>
                <button class="btn btn-primary" id="process-btn" type="submit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                  Processar URL
                </button>
              </div>
            </form>
          </div>

          <div class="url-hint" id="demo-link-wrap">
            <span data-i18n="hero.demoHint">O download real depende do conteúdo.</span> <button class="chip" id="demo-btn" type="button" data-i18n="hero.demoBtn">Ver demonstração visual do resultado</button>
          </div>

          <div class="chips" role="group" aria-label="URLs de exemplo">
            ${EXAMPLE_URLS.map(
              (e) => `<button class="chip" type="button" data-example-url="${escapeHtml(e.url)}">${escapeHtml(e.label)}</button>`,
            ).join('')}
          </div>

          <div id="url-status" aria-live="polite"></div>
        </div>

        <p class="hint-note" data-i18n="hero.legal">
          Use esta ferramenta somente para baixar conteúdos que você possui, tem autorização para utilizar ou cujo download seja permitido pelos termos da respectiva plataforma.
        </p>
      </div>
    </section>
  `;
}

function loadingTemplate(message: string): string {
  return `
    <div class="loading-message" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

function kindLabel(kind: FormatKind | null): string {
  if (kind === 'video') return t('result.downloadVideo');
  if (kind === 'audio') return t('result.downloadAudio');
  if (kind === 'image') return t('result.downloadImage');
  return t('result.select');
}

function thumbTemplate(thumb: string | undefined): string {
  if (thumb) {
    return `<img class="result-thumb media" src="${escapeHtml(thumb)}" loading="lazy" alt="" width="320" height="180" />`;
  }
  return `
    <div class="result-thumb" role="img" aria-label="Miniatura ilustrativa do conteúdo">
      <span class="play-badge" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </span>
    </div>`;
}

function resultTemplate(result: ResultData, isDemo: boolean): string {
  const videos = result.formats.filter((f) => f.kind === 'video');
  const audio = result.formats.filter((f) => f.kind === 'audio');
  const images = result.formats.filter((f) => f.kind === 'image');

  return `
    <div class="result-wrap">
      ${isDemo ? '<div class="demo-note"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg> <span data-i18n="demo.note">Demonstração visual — nenhum download real é gerado</span></div>' : ''}
      <section class="result-card" aria-label="Opções de download">
        <div class="result-body">
          ${thumbTemplate(result.thumbnail)}
          <div>
            <div class="result-meta">
              <span class="platform-tag">${escapeHtml(result.platform)}</span>
              ${result.duration ? `<span class="duration-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${formatDuration(result.duration)}</span>` : ''}
            </div>
            <h3 class="result-title">${escapeHtml(result.title)}</h3>

            <div class="format-group">
              ${videos.length
                ? `<div class="format-block">
                  <h4 data-i18n="result.video">Vídeo</h4>
                  <div class="format-options" data-video-options>
                    <button class="format-option" type="button" data-kind="video" data-format="MP4" data-quality="Melhor" data-id="best" data-i18n="result.best">Melhor qualidade</button>
                    ${videos
                      .map(
                        (f) =>
                          `<button class="format-option" type="button" data-kind="video" data-format="${escapeHtml(f.format)}" data-quality="${escapeHtml(f.quality)}" data-id="${escapeHtml(f.id)}">${escapeHtml(f.quality)}</button>`,
                      )
                      .join('')}
                  </div>
                </div>`
                : ''}
              ${audio.length
                ? `<div class="format-block">
                  <h4 data-i18n="result.audio">Áudio MP3</h4>
                  <div class="format-options">
                    ${audio
                      .map(
                        () =>
                          `<button class="format-option" type="button" data-kind="audio" data-format="MP3" data-quality="áudio" data-id="${escapeHtml(audio[0].id)}" data-i18n="result.audioMusic">Música (MP3)</button>`,
                      )
                      .join('')}
                  </div>
                </div>`
                : ''}
              ${images.length
                ? `<div class="format-block">
                <h4 data-i18n="result.image">Imagem</h4>
                <div class="format-options">
                  ${images
                    .map(
                      (f) =>
                        `<button class="format-option" type="button" data-kind="image" data-format="${escapeHtml(f.format)}" data-quality="${escapeHtml(f.quality)}" data-id="${escapeHtml(f.id)}" data-i18n="result.original">${escapeHtml(f.quality)}</button>`,
                    )
                    .join('')}
                </div>
              </div>`
                : ''}
            </div>

            <div class="download-row">
              <button class="btn btn-primary" type="button" data-download disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                <span data-download-label>${t('result.select')}</span>
              </button>
              <span class="size-note" data-size-note></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function errorInfo(code: string): { title: string; detail: string } {
  const combined = t(`error.${code}`);
  const idx = combined.indexOf('. ');
  if (idx === -1) {
    return { title: combined, detail: '' };
  }
  return { title: combined.slice(0, idx), detail: combined.slice(idx + 2) };
}

function errorTemplate(code: string): string {
  const info = errorInfo(code);
  return `
    <div class="result-wrap">
      <section class="error-card" role="alert">
        <h3>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg>
          ${escapeHtml(info.title)}
        </h3>
        <p>${escapeHtml(info.detail)}</p>
        <button class="btn btn-primary" type="button" data-retry>${escapeHtml(t('error.retry'))}</button>
      </section>
    </div>
  `;
}

export function initUrlTool(mount: HTMLElement): void {
  const panel = mount.querySelector<HTMLElement>('#url-panel');
  const input = mount.querySelector<HTMLInputElement>('#url-input');
  const form = mount.querySelector<HTMLFormElement>('#url-form');
  const pasteBtn = mount.querySelector<HTMLButtonElement>('#paste-btn');
  const status = mount.querySelector<HTMLDivElement>('#url-status');
  const chips = mount.querySelectorAll<HTMLButtonElement>('[data-example-url]');
  const demoBtn = mount.querySelector<HTMLButtonElement>('#demo-btn');

  let busy = false;
  let sourceUrl = '';
  const selection = { kind: null as FormatKind | null, format: '', quality: '' };

  const clearContent = (): void => {
    const existing = status?.querySelector('.result-wrap');
    existing?.remove();
  };

  const renderStatus = (html: string): void => {
    if (status) status.innerHTML = html;
  };

  const setBusy = (value: boolean): void => {
    busy = value;
    const btn = mount.querySelector<HTMLButtonElement>('#process-btn');
    if (btn) btn.disabled = value;
  };

  const renderResultSelection = (current: ResultData): void => {
    const labelEl = status?.querySelector<HTMLSpanElement>('[data-download-label]');
    const sizeEl = status?.querySelector<HTMLSpanElement>('[data-size-note]');
    const downloadBtn = status?.querySelector<HTMLButtonElement>('[data-download]');
    const opts = status?.querySelectorAll<HTMLButtonElement>('.format-option');
    if (!opts || !labelEl || !sizeEl || !downloadBtn) return;

    const refresh = (): void => {
      const active = [...opts].find((o) => o.classList.contains('is-active'));
      if (!active) {
        selection.kind = null;
        selection.format = '';
        selection.quality = '';
        labelEl.textContent = t('result.select');
        sizeEl.textContent = '';
        downloadBtn.disabled = true;
        return;
      }

      const kind = (active.dataset.kind ?? '') as FormatKind;
      selection.kind = kind;
      selection.format = active.dataset.format ?? '';
      selection.quality = active.dataset.quality ?? '';
      const fmt = current.formats.find((f) => f.id === (active.dataset.id ?? ''));
      const size = fmt?.size;

      labelEl.textContent = kindLabel(kind);
      downloadBtn.disabled = false;
      if (size && size > 0) {
        sizeEl.textContent = `aprox. ${formatBytes(size)}`;
      } else {
        sizeEl.textContent = t('result.sizeUnknown');
      }
    };

    opts.forEach((opt) => {
      opt.addEventListener('click', () => {
        opts.forEach((o) => o.classList.remove('is-active'));
        opt.classList.add('is-active');
        refresh();
      });
    });
    refresh();
  };

  const renderResult = (result: ResultData, isDemo: boolean): void => {
    clearContent();
    renderStatus(resultTemplate(result, isDemo));
    renderResultSelection(result);

    const downloadBtn = status?.querySelector<HTMLButtonElement>('[data-download]');
    downloadBtn?.addEventListener('click', () => {
      if (isDemo) {
        if (selection.kind === null) return;
        downloadBtn.disabled = true;
        downloadBtn.querySelector<HTMLSpanElement>('[data-download-label]')?.replaceWith(
          Object.assign(document.createElement('span'), { textContent: t('demo.done') }),
        );
        setTimeout(() => renderResultSelection(result), 1600);
        return;
      }

      if (!sourceUrl) return;
      if (selection.kind === null || !selection.format || !selection.quality) return;

      const href = buildDownloadUrl(sourceUrl, selection.format, selection.quality);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = '';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    });
  };

  const renderError = (code = 'request-failed'): void => {
    clearContent();
    renderStatus(errorTemplate(code));
    const retry = status?.querySelector<HTMLButtonElement>('[data-retry]');
    retry?.addEventListener('click', () => {
      input?.focus();
      void handleProcess();
    });
  };

  const handleProcess = async (): Promise<void> => {
    if (busy) return;
    const raw = input?.value.trim() ?? '';
    if (!raw) {
      input?.focus();
      return;
    }

    setBusy(true);
    renderStatus(loadingTemplate(t('loading.analyzing')));

    let valid = false;
    try {
      const u = new URL(raw);
      valid = u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      valid = false;
    }

    if (!valid) {
      setBusy(false);
      renderError('url-invalid');
      return;
    }

    try {
      const res = await processUrl(raw);
      setBusy(false);
      if (res.ok && res.data) {
        sourceUrl = raw;
        renderStatus(loadingTemplate(t('loading.preparing')));
        const data = res.data;
        setTimeout(() => {
          renderResult(
            {
              title: data.title,
              platform: data.platform,
              thumbnail: data.thumbnail,
              duration: data.duration,
              formats: data.formats.map((f) => ({
                id: f.id,
                kind: f.kind,
                format: f.format,
                quality: f.quality,
                ext: f.ext,
                size: f.size,
              })),
            },
            false,
          );
        }, 600);
        return;
      }
      setBusy(false);
      renderError('process-failed');
    } catch (err) {
      setBusy(false);
      renderError(err instanceof ApiError && err.code ? err.code : 'process-failed');
    }
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    void handleProcess();
  });

  input?.addEventListener('focus', () => panel?.classList.add('is-focused'));
  input?.addEventListener('blur', () => panel?.classList.remove('is-focused'));
  input?.addEventListener('input', () => {
    const rw = status?.querySelector('.result-wrap');
    rw?.remove();
  });

  pasteBtn?.addEventListener('click', async () => {
    if (!input) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        input.value = text;
      }
      input.focus();
    } catch {
      input.focus();
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (input) {
        input.value = chip.dataset.exampleUrl ?? '';
        input.focus();
      }
    });
  });

  demoBtn?.addEventListener('click', () => {
    setBusy(true);
    renderStatus(loadingTemplate(t('loading.analyzing')));
    setTimeout(() => {
      renderStatus(loadingTemplate(t('loading.preparing')));
      setTimeout(() => {
        setBusy(false);
        renderResult(DEMO, true);
      }, 900);
    }, 900);
  });
}