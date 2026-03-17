import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { registrationsApi } from '../api/registrationsApi';
import { StatusBanner } from '../components/StatusBanner';
import { useAuth } from '../context/AuthContext';
import type { Registration } from '../types';
import { formatDateTime, formatStatus } from '../utils/format';

export function AccountPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRegistrations = async () => {
      if (user?.role !== 'student') {
        setLoading(false);
        return;
      }

      try {
        const data = await registrationsApi.my();
        setRegistrations(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Не удалось загрузить ваши регистрации.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRegistrations();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <section className="page-section">
      <div className="container dashboard-grid">
        <div className="panel panel--padded">
          <div className="section-subtitle">Профиль</div>
          <h1>{user.full_name}</h1>
          <ul className="info-list">
            <li>
              <span>Email</span>
              <strong>{user.email}</strong>
            </li>
            <li>
              <span>Роль</span>
              <strong>{formatStatus(user.role)}</strong>
            </li>
          </ul>

          {user.role === 'admin' && (
            <div className="card-actions">
              <Link className="primary-button" to="/admin/events">
                Перейти в админ-панель
              </Link>
            </div>
          )}
        </div>

        <div className="panel panel--padded">
          <div className="section-subtitle">Мои регистрации</div>
          <h2>Заявки на мероприятия</h2>

          {error && <StatusBanner tone="error" message={error} />}
          {loading && <div className="empty-state">Загрузка регистраций...</div>}

          {!loading && user.role !== 'student' ? (
            <div className="empty-state">
              Для администратора основной рабочий интерфейс находится в панели управления.
            </div>
          ) : null}

          {!loading && user.role === 'student' && registrations.length === 0 ? (
            <div className="empty-state">
              Вы еще не зарегистрировались ни на одно мероприятие.
            </div>
          ) : null}

          {!loading && registrations.length > 0 ? (
            <div className="form-grid">
              {registrations.map((registration) => (
                <div key={registration.id} className="card">
                  <div className="registration-row">
                    <strong>{registration.title}</strong>
                    <span className="badge">{formatStatus(registration.status)}</span>
                  </div>
                  <div className="muted">{registration.short_description}</div>
                  <div className="muted">{formatDateTime(registration.event_date)}</div>
                  <Link className="ghost-button" to={`/events/${registration.event_id}`}>
                    Открыть мероприятие
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
