import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { eventsApi } from '../api/eventsApi';
import { registrationsApi } from '../api/registrationsApi';
import { EventCard } from '../components/EventCard';
import { StatusBanner } from '../components/StatusBanner';
import type { EventItem, Participant, StatsResponse } from '../types';
import { formatDateTime, formatStatus } from '../utils/format';

export function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [status, setStatus] = useState<{ tone: 'success' | 'error' | 'info'; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const params = new URLSearchParams({ all: '1' });
      const [eventList, statsData] = await Promise.all([eventsApi.list(params), adminApi.stats()]);
      setEvents(eventList);
      setStats(statsData);
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось загрузить панель администратора.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const loadParticipants = async (eventId: number) => {
    try {
      const data = await registrationsApi.eventParticipants(eventId);
      setParticipants(data);
      setSelectedEventId(eventId);
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось загрузить участников.',
      });
    }
  };

  const handleArchive = async (eventId: number) => {
    try {
      await eventsApi.archive(eventId);
      setStatus({ tone: 'info', message: 'Мероприятие переведено в архивный статус.' });
      void loadDashboard();
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось архивировать мероприятие.',
      });
    }
  };

  return (
    <section className="page-section">
      <div className="container dashboard-grid">
        <div className="toolbar">
          <div>
            <div className="section-subtitle">Администратор</div>
            <h1>Управление мероприятиями</h1>
          </div>
          <Link className="primary-button" to="/admin/events/new">
            Создать мероприятие
          </Link>
        </div>

        {status && <StatusBanner tone={status.tone} message={status.message} />}

        {stats ? (
          <div className="stats-row">
            <div className="stat-card">
              <strong>{stats.summary.total_events}</strong>
              <span className="muted">всего мероприятий</span>
            </div>
            <div className="stat-card">
              <strong>{stats.summary.total_registrations}</strong>
              <span className="muted">активных регистраций</span>
            </div>
            <div className="stat-card">
              <strong>{stats.summary.total_students}</strong>
              <span className="muted">зарегистрированных студентов</span>
            </div>
          </div>
        ) : null}

        {loading ? <div className="empty-state">Загрузка данных...</div> : null}

        {!loading ? (
          <div className="cards-grid">
            {events.map((event) => (
              <div key={event.id} className="card">
                <EventCard event={event} adminMode />
                <div className="card-actions">
                  <button className="ghost-button" type="button" onClick={() => void loadParticipants(event.id)}>
                    Участники
                  </button>
                  <button className="danger-button" type="button" onClick={() => void handleArchive(event.id)}>
                    Архивировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="panel panel--padded">
          <div className="section-subtitle">Статистика по событиям</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Мероприятие</th>
                  <th>Статус</th>
                  <th>Регистрации</th>
                  <th>Вместимость</th>
                </tr>
              </thead>
              <tbody>
                {stats?.events.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{formatStatus(item.status)}</td>
                    <td>{item.registrations_count}</td>
                    <td>{item.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel panel--padded">
          <div className="section-subtitle">Участники мероприятия</div>
          {selectedEventId === null ? (
            <div className="empty-state">Выберите мероприятие, чтобы посмотреть зарегистрированных участников.</div>
          ) : participants.length === 0 ? (
            <div className="empty-state">У выбранного мероприятия пока нет регистраций.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Студент</th>
                    <th>Email</th>
                    <th>Группа</th>
                    <th>Статус</th>
                    <th>Дата регистрации</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td>{participant.full_name}</td>
                      <td>{participant.email}</td>
                      <td>{participant.group_name || 'Не указана'}</td>
                      <td>{formatStatus(participant.status)}</td>
                      <td>{formatDateTime(participant.registered_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
