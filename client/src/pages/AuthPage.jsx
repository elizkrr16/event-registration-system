import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import NotificationBlock from '../components/NotificationBlock';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(query.get('mode') === 'register' ? 'register' : 'login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMode(query.get('mode') === 'register' ? 'register' : 'login');
  }, [query]);

  const targetPath = location.state?.from || '/account';

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(loginForm.email, loginForm.password);
      navigate(user.role === 'admin' ? '/admin' : targetPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: registerForm.full_name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
      });
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container auth-layout">
        <div className="card auth-card">
          <div className="auth-switcher">
            <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}>
              Вход
            </button>
            <button type="button" className={mode === 'register' ? 'is-active' : ''} onClick={() => setMode('register')}>
              Регистрация
            </button>
          </div>

          <div className="section-kicker">{mode === 'login' ? 'Авторизация' : 'Создание аккаунта'}</div>
          <h1>{mode === 'login' ? 'Вход в систему НаВстречу' : 'Регистрация нового участника'}</h1>

          {error ? <NotificationBlock type="error" title="Ошибка" message={error} /> : null}

          {mode === 'login' ? (
            <form className="form-grid" onSubmit={handleLogin}>
              <Input
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                required
              />
              <Input
                label="Пароль"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          ) : (
            <form className="form-grid" onSubmit={handleRegister}>
              <Input
                label="Имя и фамилия"
                value={registerForm.full_name}
                onChange={(event) => setRegisterForm({ ...registerForm, full_name: event.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                required
              />
              <Input
                label="Телефон"
                value={registerForm.phone}
                onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
                required
              />
              <Input
                label="Пароль"
                type="password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                required
              />
              <Input
                label="Повторите пароль"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
