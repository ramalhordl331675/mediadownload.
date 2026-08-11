/**
 * Códigos de erro amigáveis retornados pela API.
 * Nenhum detalhe técnico é exposto ao cliente.
 */
export const ErrorCodes = {
  URL_INVALID: 'url-invalid',
  PLATFORM_UNSUPPORTED: 'platform-unsupported',
  CONTENT_PRIVATE: 'content-private',
  PROCESS_FAILED: 'process-failed',
  DOWNLOAD_FAILED: 'download-failed',
  TOO_LARGE: 'too-large',
  BUSY: 'busy',
  TIMEOUT: 'timeout',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export function isErrorCode(value: string): value is ErrorCode {
  return Object.values(ErrorCodes).includes(value as ErrorCode);
}