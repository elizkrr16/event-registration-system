const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/event-registration-system/server/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Сервер вернул некорректный ответ.',
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Ошибка запроса.');
  }

  return payload.data;
}

export const api = {
  get(path) {
    return request(path);
  },
  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body || {}),
    });
  },
};
