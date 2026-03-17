import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBanner } from '../components/StatusBanner';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    group_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        group_name: form.group_name,
        phone: form.phone,
      });
      navigate('/account');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка регистрации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container auth-grid" style={{ maxWidth: '640px' }}>
        <div className="panel panel--padded">
          <div className="section-subtitle">Регистрация</div>
          <h1>Создание аккаунта участника</h1>

          {error && <StatusBanner tone="error" message={error} />}

          <form className="form-grid" onSubmit={(event) => void handleSubmit(event)}>
            <div className="field">
              <label htmlFor="full_name">ФИО</label>
              <input
                id="full_name"
                value={form.full_name}
                onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                required
              />
            </div>

            <div className="filters">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Телефон</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
            </div>

            <div className="filters">
              <div className="field">
                <label htmlFor="group_name">Группа</label>
                <input
                  id="group_name"
                  value={form.group_name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, group_name: event.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="password">Пароль</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="confirm_password">Подтверждение пароля</label>
                <input
                  id="confirm_password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Регистрация...' : 'Создать аккаунт'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
