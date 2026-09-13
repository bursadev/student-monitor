import Constants from 'expo-constants';

/** Where the NestJS backend listens (apps/backend/src/main.ts). */
const BACKEND_PORT = 3001;

/**
 * Work out how to reach our API from whatever this bundle is running on.
 *
 * `localhost` is only correct on the iOS simulator: an Android emulator reaches
 * the host machine at 10.0.2.2, and a physical device needs the LAN address. So
 * rather than make everyone maintain a per-device `.env`, derive it from the
 * dev server the bundle was downloaded from — `hostUri` looks like
 * "192.168.1.20:8081", and the backend runs on that same machine.
 *
 * `EXPO_PUBLIC_API_URL` overrides everything, which is what staging and
 * production builds will set.
 */
export function resolveApiBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${BACKEND_PORT}`;

  // A production bundle with no configured URL: nothing sensible is left to
  // guess, and localhost at least fails loudly on a simulator.
  return `http://localhost:${BACKEND_PORT}`;
}
