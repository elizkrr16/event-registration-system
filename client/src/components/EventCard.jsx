import { Link } from 'react-router-dom';
import Button from './Button';
import { formatDateTime, formatFormat, formatStatus } from '../utils/format';

function EventCard({ event, compact = false }) {
  const freePlaces = event.capacity - event.registrations_count;

  return (
    <article className={`event-card card ${compact ? 'event-card--compact' : ''}`.trim()}>
      <div className="event-card__meta">
        <span className={`status-pill status-pill--${event.status}`}>{formatStatus(event.status)}</span>
        <span className="status-pill status-pill--format">{formatFormat(event.format)}</span>
      </div>

      <h3>{event.title}</h3>
      <p>{event.short_description}</p>

      <ul className="event-card__details">
        <li>{formatDateTime(event.starts_at)}</li>
        <li>{event.city}</li>
        <li>{event.category_name}</li>
        <li>Свободных мест: {freePlaces}</li>
      </ul>

      <Link to={`/events/${event.event_id}`}>
        <Button variant="ghost">Подробнее</Button>
      </Link>
    </article>
  );
}

export default EventCard;
