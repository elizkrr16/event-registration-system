import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import logo from '../assets/logo.svg';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand">
          <img src={logo} alt="НаВстречу" className="brand__logo" />
          <div>
            <strong>НаВстречу</strong>
            <span>Регистрация на мероприятия</span>
          </div>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/events">Мероприятия</NavLink>
          <NavLink to="/about">О проекте</NavLink>
          <NavLink to="/contacts">Контакты</NavLink>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/account'} className="header-user">
                {user.full_name}
              </Link>
              <Button variant="ghost" type="button" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login">
                <Button variant="ghost">Войти</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Регистрация</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
