import { toMediaFormats, formatSelector } from '../src/services/ytdlp';
import { classifyYtDlpFailure } from '../src/utils/ytdlpErrors';
import { ErrorCodes } from '../src/errors';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    console.error(`FALHOU: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`ok: ${label}`);
  }
}

const videoEntry = {
  id: 'v1',
  formats: [
    { format_id: '137', ext: 'mp4', height: 1080, filesize: 1000, url: 'x' },
    { format_id: '136', ext: 'mp4', height: 720, filesize: 800, url: 'y' },
    { format_id: '137', ext: 'mp4', height: 1080, filesize: 900, url: 'z' },
    { format_id: '251', ext: 'webm', url: 'a' },
  ],
};

const videoOut = toMediaFormats(videoEntry);
assert(videoOut.length === 3, `vídeo -> 3 formatos (MP4 deduplicado + MP3), obteve ${videoOut.length}`);
assert(videoOut[0].quality === '1080p' && videoOut[1].quality === '720p', 'vitórias ordenadas e deduplicadas por altura');
assert(videoOut[0].kind === 'video' && videoOut[0].ext === 'mp4' && videoOut[0].id === '137', 'vídeo: kind/ext/id explícitos');
assert(videoOut.some((f) => f.format === 'MP3'), 'áudio MP3 presente');
const audioOut = videoOut.find((f) => f.kind === 'audio');
assert(audioOut?.kind === 'audio' && audioOut.format === 'MP3' && audioOut.ext === 'mp3' && audioOut.quality === 'áudio', 'áudio: kind/format/ext/quality corretos');

const imageEntry = {
  id: 'i1',
  url: 'https://cdn/image.jpg',
  filesize: 54321,
  title: 'imagem',
  formats: [],
};
const imageOut = toMediaFormats(imageEntry);
assert(imageOut.length === 1 && imageOut[0].format === 'IMAGEM' && imageOut[0].quality === 'Original', 'imagem sem formats -> IMAGEM Original');
assert(imageOut[0].kind === 'image' && imageOut[0].ext === 'jpg', 'imagem: kind/ext corretos');
assert(imageOut[0].size === 54321, 'tamanho da imagem preservado');

const emptyEntry = { id: 'e1', formats: [] };
assert(toMediaFormats(emptyEntry).length === 0, 'sem formats e sem url -> lista vazia (não inventa)');

assert(formatSelector('MP3', 'áudio') === 'bestaudio/best', 'seleção MP3');
assert(formatSelector('MP4', '1080p') === 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best[height<=1080]', 'seleção MP4 1080p prioriza bestvideo+bestaudio');
assert(formatSelector('MP4', 'Melhor') === 'bestvideo+bestaudio/best', 'seleção MP4 Melhor qualidade sem limite de altura');
assert(formatSelector('IMAGEM', 'Original') === 'best', 'seleção IMAGEM');

const privateErr = { stderr: 'ERROR: [youtube] abc123: Private video. Sign in to confirm if this video belongs to you and that you haven\u2019t violated the Terms of Service.' };
assert(classifyYtDlpFailure(privateErr) === ErrorCodes.CONTENT_PRIVATE, 'vídeo privado -> content-private');
const otherErr = { stderr: 'ERROR: something completely different broke' };
assert(classifyYtDlpFailure(otherErr) === undefined, 'erro genérico -> sem classificação (vira process-failed)');

console.log(process.exitCode ? '\nCom falhas.' : '\nTodos os testes de unidade passaram.');