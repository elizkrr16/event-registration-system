import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StatusBanner } from '../components/StatusBanner';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/account';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка входа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container auth-grid" style={{ maxWidth: '560px' }}>
        <div className="panel panel--padded">
          <div className="section-subtitle">Вход</div>
          <h1>Авторизация пользователя</h1>
          <p className="section-description">
            Для теста можно использовать `admin@events.local / admin123` или одного из студентов из
            `seed.sql`.
          </p>

          {error && <StatusBanner tone="error" message={error} />}

          <form className="form-grid" onSubmit={(event) => void handleSubmit(event)}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="muted">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
