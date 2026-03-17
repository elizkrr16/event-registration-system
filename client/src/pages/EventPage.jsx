import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import eventsService from '../services/eventsService';
import registrationsService from '../services/registrationsService';
import RegistrationForm from '../components/RegistrationForm';
import NotificationBlock from '../components/NotificationBlock';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatFormat, formatStatus, splitProgram } from '../utils/format';

function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const loadEvent = async () => {
    try {
      const data = await eventsService.details(eventId);
      setEvent(data);
    } catch (err) {
      setNotification({ type: 'error', title: 'Ошибка', message: err.message });
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  if (!event) {
    return (
      <section className="page-section">
        <div className="container">{notification ? <NotificationBlock {...notification} /> : <div className="card">Загрузка...</div>}</div>
      </section>
    );
  }

  const alreadyRegistered = event.current_user_registration && event.current_user_registration.status === 'registered';
  const noPlaces = event.capacity - event.registrations_count <= 0;

  let disabledReason = '';

  if (alreadyRegistered) {
    disabledReason = 'Вы уже записаны на это мероприятие.';
  } else if (user && user.role !== 'student') {
    disabledReason = 'Запись доступна только обычным участникам.';
  } else if (event.status !== 'published') {
    disabledReason = 'Запись на это мероприятие закрыта.';
  } else if (noPlaces) {
    disabledReason = 'Свободных мест нет.';
  }

  const handleRegister = async () => {
    try {
      await registrationsService.create(event.event_id);
      setConfirmOpen(false);
      setSuccessOpen(true);
      loadEvent();
    } catch (err) {
      setConfirmOpen(false);
      setNotification({ type: 'error', title: 'Ошибка регистрации', message: err.message });
    }
  };

  return (
    <section className="page-section">
      <div className="container event-layout">
        <div className="card event-main">
          <div className="event-page__meta">
            <span className={`status-pill status-pill--${event.status}`}>{formatStatus(event.status)}</span>
            <span className="status-pill status-pill--format">{formatFormat(event.format)}</span>
          </div>
          <h1>{event.title}</h1>
          <p className="lead-text">{event.description}</p>

          {notification ? <NotificationBlock {...notification} /> : null}

          <div className="event-info-grid">
            <div className="event-info">
              <span>Дата и время</span>
              <strong>
                {formatDateTime(event.starts_at)} — {formatDateTime(event.ends_at)}
              </strong>
            </div>
            <div className="event-info">
              <span>Место</span>
              <strong>{event.location}</strong>
            </div>
            <div className="event-info">
              <span>Город</span>
              <strong>{event.city}</strong>
            </div>
            <div className="event-info">
              <span>Категория</span>
              <strong>{event.category_name}</strong>
            </div>
          </div>

          <div className="card card--subtle">
            <div className="section-kicker">Программа мероприятия</div>
            <ul className="list-clean">
              {splitProgram(event.program).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <RegistrationForm
          event={event}
          user={user}
          statusMessage={notification}
          disabledReason={disabledReason}
          onLoginRedirect={() => navigate('/auth?mode=login')}
          onRegisterClick={() => setConfirmOpen(true)}
        />
      </div>

      <Modal
        open={confirmOpen}
        title="Подтверждение регистрации"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <Button variant="ghost" type="button" onClick={() => setConfirmOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={handleRegister}>
              Подтвердить
            </Button>
          </>
        }
      >
        <p>Подтвердить запись на мероприятие «{event.title}»?</p>
      </Modal>

      <Modal
        open={successOpen}
        title="Регистрация выполнена"
        onClose={() => setSuccessOpen(false)}
        actions={
          <Button type="button" onClick={() => setSuccessOpen(false)}>
            Понятно
          </Button>
        }
      >
        <p>Запись сохранена. Мероприятие появилось в вашем личном кабинете.</p>
      </Modal>
    </section>
  );
}

export default EventPage;
