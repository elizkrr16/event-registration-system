import { Link } from 'react-router-dom';
import type { EventItem } from '../types';
import { formatDateTime, formatStatus } from '../utils/format';

export function EventCard({ event, adminMode = false }: { event: EventItem; adminMode?: boolean }) {
  const freePlaces = event.capacity - event.registrations_count;
  const badgeClass =
    event.status === 'cancelled'
      ? 'badge badge--danger'
      : event.status === 'closed' || event.status === 'draft'
        ? 'badge badge--warning'
        : 'badge';

  return (
    <article className="card">
      <div className="card-top">
        <span className={badgeClass}>{formatStatus(event.status)}</span>
        <span className="muted">{event.category_name}</span>
      </div>

      <div>
        <h3>{event.title}</h3>
        <p className="muted">{event.short_description}</p>
      </div>

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
          <span>Свободные места</span>
          <strong>{freePlaces}</strong>
        </li>
      </ul>

      <div className="card-actions">
        <Link className="ghost-button" to={`/events/${event.id}`}>
          Подробнее
        </Link>
        {adminMode && (
          <Link className="primary-button" to={`/admin/events/${event.id}/edit`}>
            Редактировать
          </Link>
        )}
      </div>
    </article>
  );
}
