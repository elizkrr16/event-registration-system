import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import registrationsService from '../services/registrationsService';
import NotificationBlock from '../components/NotificationBlock';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { formatDateTime, formatRole, formatStatus } from '../utils/format';

function AccountPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [cancelId, setCancelId] = useState(null);

  const loadRegistrations = async () => {
    if (user.role !== 'student') {
      return;
    }

    try {
      const data = await registrationsService.my();
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [user.role]);

  const grouped = useMemo(() => {
    const now = Date.now();

    return {
      active: registrations.filter(
        (item) => item.registration_status === 'registered' && new Date(item.ends_at).getTime() >= now && item.event_status === 'published'
      ),
      past: registrations.filter((item) => new Date(item.ends_at).getTime() < now),
      cancelled: registrations.filter(
        (item) => item.registration_status === 'cancelled' || item.event_status === 'cancelled'
      ),
    };
  }, [registrations]);

  const handleCancel = async () => {
    try {
      await registrationsService.cancel(cancelId);
      setCancelId(null);
      loadRegistrations();
    } catch (err) {
      setError(err.message);
      setCancelId(null);
    }
  };

  return (
    <section className="page-section">
      <div className="container account-layout">
        <div className="card profile-card">
          <div className="section-kicker">Личный кабинет</div>
          <h1>{user.full_name}</h1>
          <ul className="list-clean">
            <li>Email: {user.email}</li>
            <li>Телефон: {user.phone || 'Не указан'}</li>
            <li>Роль: {formatRole(user.role)}</li>
          </ul>
          <NotificationBlock
            type="info"
            title="Уведомления"
            message="В этом разделе отображаются ваши активные и завершенные регистрации."
          />
        </div>

        <div className="account-content">
          {error ? <NotificationBlock type="error" title="Ошибка" message={error} /> : null}

          {['active', 'past', 'cancelled'].map((group) => (
            <div className="card" key={group}>
              <h2>
                {group === 'active' ? 'Активные мероприятия' : group === 'past' ? 'Прошедшие' : 'Отмененные'}
              </h2>

              {grouped[group].length === 0 ? (
                <p>Нет записей в этой категории.</p>
              ) : (
                grouped[group].map((item) => (
                  <div className="account-item" key={item.registration_id}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.short_description}</p>
                      <small>
                        {formatDateTime(item.starts_at)} · {item.location}
                      </small>
                    </div>
                    <div className="account-item__actions">
                      <span className={`status-pill status-pill--${item.event_status}`}>{formatStatus(item.event_status)}</span>
                      {group === 'active' ? (
                        <Button variant="danger" type="button" onClick={() => setCancelId(item.event_id)}>
                          Отменить запись
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(cancelId)}
        title="Отмена регистрации"
        onClose={() => setCancelId(null)}
        actions={
          <>
            <Button variant="ghost" type="button" onClick={() => setCancelId(null)}>
              Нет
            </Button>
            <Button variant="danger" type="button" onClick={handleCancel}>
              Да, отменить
            </Button>
          </>
        }
      >
        <p>Вы действительно хотите отменить регистрацию на мероприятие?</p>
      </Modal>
    </section>
  );
}

export default AccountPage;
