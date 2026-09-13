import { resolveApiBaseUrl } from './base-url';

/**
 * A failed API call, carrying copy that is already safe to show a user.
 *
 * The backend's global exception filter guarantees every error body is
 * `{ statusCode, message }` with the message in Turkish, so there is nothing to
 * translate on this side — see apps/backend/src/shared/http.
 */
export class ApiError extends Error {
  /** 0 when the request never reached the server. */
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  /** Clerk session token. The identity feature owns Clerk and supplies it. */
  token?: string | null;
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * One call to our API. Deliberately free of React and of Clerk: `shared/**`
 * must not import `features/**`, so the caller passes the token in rather than
 * this module reaching for the session itself.
 *
 * Returns `null` for 204, which is what DELETE /api/me answers with.
 */
export async function apiRequest<T = unknown>(
  path: string,
  { method = 'GET', token, body, signal }: RequestOptions = {},
): Promise<T | null> {
  const url = `${resolveApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    // No response at all — the backend is not running, the device is on another
    // network, or the LAN address moved. By far the most common failure while
    // developing, so it gets its own message instead of a generic one.
    throw new ApiError(0, 'Sunucuya ulaşılamadı. Bağlantını kontrol et.');
  }

  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));

  if (response.status === 204) return null;

  return (await response.json()) as T;
}

/**
 * Prefer the server's Turkish message. Anything that is not our error shape —
 * a proxy's HTML page, a truncated body — must not reach the user, so fall back
 * rather than render whatever arrived.
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    const message = (body as { message?: unknown })?.message;
    if (typeof message === 'string' && message.length > 0) return message;
  } catch {
    // fall through
  }
  return 'Beklenmeyen bir hata oluştu.';
}
