import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import eventsService from '../services/eventsService';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import NotificationBlock from '../components/NotificationBlock';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsService
      .list({ tab: 'upcoming', limit: 3 })
      .then(setEvents)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-card">
            <div className="section-kicker">Система регистрации на мероприятия</div>
            <h1>НаВстречу</h1>
            <p>
              Веб-сайт для публикации событий, регистрации участников и управления мероприятиями в рамках дипломного проекта.
            </p>
            <div className="stack-row">
              <Link to="/events">
                <Button>Перейти в каталог</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button variant="ghost">Создать аккаунт</Button>
              </Link>
            </div>
          </div>

          <div className="hero-side card">
            <h3>Что умеет система</h3>
            <ul className="list-clean">
              <li>Показывает актуальные мероприятия из MySQL</li>
              <li>Позволяет участнику записываться и отменять запись</li>
              <li>Даёт администратору инструменты публикации и контроля</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container section-head">
          <div>
            <div className="section-kicker">Ближайшие мероприятия</div>
            <h2>События, на которые уже можно записаться</h2>
          </div>
        </div>

        {error ? <NotificationBlock type="error" title="Ошибка" message={error} /> : null}

        <div className="cards-grid">
          {events.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
