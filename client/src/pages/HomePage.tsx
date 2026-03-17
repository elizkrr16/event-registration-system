import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="panel panel--padded">
            <div className="eyebrow">Дипломный проект</div>
            <h1>Регистрация участников на мероприятия в одном веб-сервисе</h1>
            <p>
              Сайт объединяет каталог мероприятий, личный кабинет участника и панель
              администратора для публикации событий, управления регистрациями и контроля
              посещаемости.
            </p>

            <div className="card-actions">
              <Link to="/events" className="primary-button">
                Перейти в каталог
              </Link>
              <Link to="/register" className="ghost-button">
                Создать аккаунт
              </Link>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <strong>3 роли</strong>
                <span className="muted">гость, участник, администратор</span>
              </div>
              <div className="stat-card">
                <strong>REST API</strong>
                <span className="muted">React frontend + PHP backend</span>
              </div>
              <div className="stat-card">
                <strong>MySQL</strong>
                <span className="muted">реальные таблицы в XAMPP</span>
              </div>
            </div>
          </div>

          <div className="panel panel--padded">
            <div className="section-subtitle">Ключевые сценарии</div>
            <ul className="info-list">
              <li>
                <span>Публикация и каталог</span>
                <strong>Карточки мероприятий и отдельная страница события</strong>
              </li>
              <li>
                <span>Работа участника</span>
                <strong>Регистрация, отмена и просмотр собственных заявок</strong>
              </li>
              <li>
                <span>Работа организатора</span>
                <strong>Создание мероприятий, статусы, участники и статистика</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container cards-grid">
          <article className="card">
            <div className="section-subtitle">Публичная часть</div>
            <h3>Каталог и карточки мероприятий</h3>
            <p className="muted">
              Поиск, фильтрация, просмотр описания, дат, мест проведения и свободных мест.
            </p>
          </article>

          <article className="card">
            <div className="section-subtitle">Личный кабинет</div>
            <h3>Регистрации и статусы</h3>
            <p className="muted">
              Участник видит свой профиль, историю регистраций и уведомления о действиях.
            </p>
          </article>

          <article className="card">
            <div className="section-subtitle">Панель администратора</div>
            <h3>Управление мероприятиями</h3>
            <p className="muted">
              Администратор создает, редактирует, архивирует события и получает статистику.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
