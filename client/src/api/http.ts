const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost/event-registration-system/server/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Invalid server response.',
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload.data as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
};
