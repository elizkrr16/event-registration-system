function AdminSidebar({ activeSection, onChange }) {
  const sections = [
    ['events', 'Мероприятия'],
    ['create', 'Создать'],
    ['participants', 'Участники'],
    ['users', 'Пользователи'],
    ['stats', 'Статистика'],
  ];

  return (
    <aside className="admin-sidebar card">
      <div className="section-kicker">НаВстречу</div>
      <h3>Админ-панель</h3>
      <div className="admin-sidebar__nav">
        {sections.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={activeSection === value ? 'admin-sidebar__link is-active' : 'admin-sidebar__link'}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default AdminSidebar;
