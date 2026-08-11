import { getLocale } from '../i18n/locale';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Every request carries `x-client-locale`. The backend echoes the resolved
 * value back as `content-language` — if those disagree, the backend did not
 * recognise the locale and fell back to `en`.
 */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-client-locale': getLocale(),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error?.code ?? 'UNKNOWN', res.status);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public code: string, public status: number) {
    super(code);
  }
}
