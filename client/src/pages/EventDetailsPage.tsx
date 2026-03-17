import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventsApi } from '../api/eventsApi';
import { registrationsApi } from '../api/registrationsApi';
import { StatusBanner } from '../components/StatusBanner';
import { useAuth } from '../context/AuthContext';
import type { EventItem } from '../types';
import { formatDateTime, formatStatus } from '../utils/format';

export function EventDetailsPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ tone: 'success' | 'error' | 'info'; message: string } | null>(
    null
  );

  const numericId = Number(eventId);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const eventData = await eventsApi.details(numericId);
      setEvent(eventData);
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось загрузить мероприятие.',
      });
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isNaN(numericId)) {
      void loadEvent();
    } else {
      setLoading(false);
      setStatus({ tone: 'error', message: 'Некорректный идентификатор мероприятия.' });
    }
  }, [numericId]);

  const handleRegister = async () => {
    try {
      await registrationsApi.create(numericId);
      setStatus({ tone: 'success', message: 'Вы успешно зарегистрировались на мероприятие.' });
      void loadEvent();
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось выполнить регистрацию.',
      });
    }
  };

  const handleCancel = async () => {
    try {
      await registrationsApi.cancel(numericId);
      setStatus({ tone: 'info', message: 'Регистрация отменена.' });
      void loadEvent();
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось отменить регистрацию.',
      });
    }
  };

  if (loading) {
    return <section className="page-section"><div className="container empty-state">Загрузка...</div></section>;
  }

  if (!event) {
    return (
      <section className="page-section">
        <div className="container">
          {status && <StatusBanner tone={status.tone} message={status.message} />}
          <div className="empty-state">Мероприятие не найдено.</div>
        </div>
      </section>
    );
  }

  const freePlaces = event.capacity - event.registrations_count;
  const alreadyRegistered = event.current_user_registration?.status === 'registered';

  return (
    <section className="page-section">
      <div className="container two-columns">
        <div className="panel panel--padded">
          <div className="card-top">
            <span className="badge">{event.category_name}</span>
            <span className="muted">{formatStatus(event.status)}</span>
          </div>

          <h1>{event.title}</h1>
          <p className="section-description">{event.description}</p>

          {status && <StatusBanner tone={status.tone} message={status.message} />}

          <ul className="info-list">
            <li>
              <span>Дата</span>
              <strong>{formatDateTime(event.event_date)}</strong>
            </li>
            <li>
              <span>Место</span>
              <strong>{event.location}</strong>
            </li>
            <li>
              <span>Организатор</span>
              <strong>{event.organizer_name}</strong>
            </li>
            <li>
              <span>Свободные места</span>
              <strong>{freePlaces}</strong>
            </li>
          </ul>

          {user?.role === 'student' ? (
            <div className="card-actions">
              {!alreadyRegistered ? (
                <button className="primary-button" type="button" onClick={() => void handleRegister()}>
                  Зарегистрироваться
                </button>
              ) : (
                <button className="danger-button" type="button" onClick={() => void handleCancel()}>
                  Отменить регистрацию
                </button>
              )}
            </div>
          ) : (
            <div className="card-actions">
              <Link className="ghost-button" to="/login">
                Войдите, чтобы зарегистрироваться
              </Link>
            </div>
          )}
        </div>

        <div className="panel panel--padded">
          <div className="section-subtitle">Кратко</div>
          <h3>{event.short_description}</h3>
          <p className="muted">
            Страница отображает реальный статус мероприятия, число регистраций и ограничения по
            вместимости.
          </p>
        </div>
      </div>
    </section>
  );
}
