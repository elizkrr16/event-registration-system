export function formatDateTime(value) {
  if (!value) {
    return 'Не указано';
  }

  return new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDate(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleDateString('ru-RU');
}

export function formatRole(role) {
  const labels = {
    student: 'Участник',
    admin: 'Администратор',
  };

  return labels[role] || role;
}

export function formatStatus(status) {
  const labels = {
    draft: 'Черновик',
    published: 'Опубликовано',
    closed: 'Закрыто',
    cancelled: 'Отменено',
    registered: 'Активна',
  };

  return labels[status] || status;
}

export function formatFormat(type) {
  const labels = {
    online: 'Онлайн',
    offline: 'Офлайн',
    hybrid: 'Гибрид',
  };

  return labels[type] || type;
}

export function splitProgram(program) {
  if (!program) {
    return [];
  }

  return program
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}
