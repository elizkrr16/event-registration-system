export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatStatus(status: string) {
  const map: Record<string, string> = {
    draft: 'Черновик',
    published: 'Опубликовано',
    closed: 'Закрыто',
    cancelled: 'Отменено',
    registered: 'Зарегистрирован',
    admin: 'Администратор',
    student: 'Участник',
  };

  return map[status] ?? status;
}
