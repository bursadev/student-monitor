/**
 * The Turkish copy the API answers with.
 *
 * This is not an i18n layer and must not grow into one — the product is Turkish
 * only, so the strings live here as literals exactly as ADR-0011 prescribes for
 * the clients. What this file buys is consistency: one wording per failure,
 * instead of whatever English string Nest, Prisma or Clerk happened to throw.
 */
export const MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'Geçersiz istek.',
  401: 'Oturum açılmamış.',
  403: 'Bu işlem için yetkiniz yok.',
  404: 'Kayıt bulunamadı.',
  405: 'Bu işlem desteklenmiyor.',
  409: 'Bu kayıt zaten var.',
  413: 'Gönderilen dosya çok büyük.',
  415: 'Desteklenmeyen dosya türü.',
  422: 'Gönderilen bilgiler doğrulanamadı.',
  429: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
  500: 'Beklenmeyen bir hata oluştu.',
  502: 'Servise şu anda ulaşılamıyor.',
  503: 'Servis şu anda kullanılamıyor.',
};

export const FALLBACK_MESSAGE = MESSAGE_BY_STATUS[500];

/**
 * The reason phrases Nest uses when an exception is constructed with no message
 * of its own (`new NotFoundException()` answers "Not Found"). Recognising them
 * is what lets the filter translate an untouched default while leaving a
 * message somebody wrote on purpose alone.
 */
const NEST_DEFAULT_MESSAGES = new Set([
  'Bad Request',
  'Unauthorized',
  'Payment Required',
  'Forbidden',
  'Not Found',
  'Method Not Allowed',
  'Not Acceptable',
  'Request Timeout',
  'Conflict',
  'Gone',
  'Payload Too Large',
  'URI Too Long',
  'Unsupported Media Type',
  'Unprocessable Entity',
  'Too Many Requests',
  'Internal Server Error',
  'Not Implemented',
  'Bad Gateway',
  'Service Unavailable',
  'Gateway Timeout',
]);

export function isNestDefaultMessage(message: string): boolean {
  return NEST_DEFAULT_MESSAGES.has(message);
}

export function messageForStatus(status: number): string {
  return MESSAGE_BY_STATUS[status] ?? FALLBACK_MESSAGE;
}
