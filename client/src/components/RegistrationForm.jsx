import Button from './Button';
import NotificationBlock from './NotificationBlock';

function RegistrationForm({ event, user, statusMessage, onRegisterClick, onLoginRedirect, disabledReason }) {
  return (
    <div className="card registration-box">
      <div className="section-kicker">Запись на мероприятие</div>
      <h3>Форма регистрации</h3>
      <p>
        После подтверждения регистрация сохранится в базе данных и появится в вашем личном кабинете.
      </p>

      {statusMessage ? (
        <NotificationBlock type={statusMessage.type} title={statusMessage.title} message={statusMessage.message} />
      ) : null}

      {!user ? (
        <Button type="button" onClick={onLoginRedirect}>
          Войти для записи
        </Button>
      ) : (
        <Button type="button" onClick={onRegisterClick} disabled={Boolean(disabledReason)}>
          Зарегистрироваться
        </Button>
      )}

      {disabledReason ? <p className="card__hint">{disabledReason}</p> : null}
      <p className="card__hint">Осталось мест: {event.capacity - event.registrations_count}</p>
    </div>
  );
}

export default RegistrationForm;
