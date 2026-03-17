import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="brand">
            <strong>Event Registration System</strong>
            <span>Разработка веб-сайта для регистрации участников на мероприятия</span>
          </div>

          <nav className="main-nav">
            <NavLink to="/">Главная</NavLink>
            <NavLink to="/events">Каталог</NavLink>
            {user && <NavLink to="/account">Личный кабинет</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin/events">Панель администратора</NavLink>}
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <span className="muted">{user.full_name}</span>
                <button className="ghost-button" type="button" onClick={() => void logout()}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="ghost-button">
                  Вход
                </NavLink>
                <NavLink to="/register" className="primary-button">
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="container site-footer">
        <span>Дипломный проект 2026</span>
        <span>React + PHP + MySQL (XAMPP)</span>
      </footer>
    </div>
  );
}
