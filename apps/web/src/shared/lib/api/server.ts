import 'server-only';

import { auth } from '@clerk/nextjs/server';

/**
 * A failed API call, carrying copy that is already safe to show a user.
 *
 * The backend's global exception filter guarantees every error body is
 * `{ statusCode, message }` with a Turkish message, so nothing needs
 * translating here — see apps/backend/src/shared/http.
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
  body?: unknown;
}

/**
 * Call our API as the signed-in user, from the server only.
 *
 * `server-only` is load-bearing: the token is minted here and the API base URL
 * is a private env var, so a stray import from a client component must fail the
 * build rather than ship either to the browser.
 *
 * Not the intended long-term shape — `Frontend Architecture.md` calls for
 * `@sm/api` shared by both clients. This is a stopgap until that package
 * exists, and the second one of its kind (mobile has its own).
 */
export async function apiRequest<T = unknown>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T | null> {
  const { getToken } = await auth();
  const token = await getToken();

  const base = (process.env.API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      // Per-user data behind auth: caching it would serve one user's row to the
      // next.
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.');
  }

  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));
  if (response.status === 204) return null;

  return (await response.json()) as T;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    const message = (body as { message?: unknown })?.message;
    if (typeof message === 'string' && message.length > 0) return message;
  } catch {
    // Not our error shape — fall through rather than render whatever arrived.
  }
  return 'Beklenmeyen bir hata oluştu.';
}
