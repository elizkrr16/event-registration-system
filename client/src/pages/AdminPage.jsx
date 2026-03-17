import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import EventForm from '../components/EventForm';
import Button from '../components/Button';
import Modal from '../components/Modal';
import NotificationBlock from '../components/NotificationBlock';
import adminService from '../services/adminService';
import eventsService from '../services/eventsService';
import registrationsService from '../services/registrationsService';
import { formatDateTime, formatStatus } from '../utils/format';

const initialForm = {
  event_id: '',
  title: '',
  short_description: '',
  description: '',
  city: 'Красноярск',
  location: '',
  format: 'offline',
  starts_at: '',
  ends_at: '',
  capacity: '30',
  category_id: '1',
  status: 'draft',
  program: '',
  image_url: '',
};

function AdminPage() {
  const [section, setSection] = useState('events');
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);

  const loadBaseData = async () => {
    try {
      const [categoriesData, eventsData, usersData, statsData] = await Promise.all([
        adminService.categories(),
        eventsService.list({ all: 1, tab: 'all' }),
        adminService.users(),
        adminService.stats(),
      ]);

      setCategories(categoriesData);
      setEvents(eventsData);
      setUsers(usersData);
      setStats(statsData);
      if (!selectedEventId && eventsData.length > 0) {
        setSelectedEventId(String(eventsData[0].event_id));
      }
    } catch (err) {
      setMessage({ type: 'error', title: 'Ошибка', message: err.message });
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    registrationsService
      .byEvent(selectedEventId)
      .then(setParticipants)
      .catch((err) => setMessage({ type: 'error', title: 'Ошибка', message: err.message }));
  }, [selectedEventId]);

  const eventMap = useMemo(() => {
    const map = new Map();
    events.forEach((event) => map.set(event.event_id, event));
    return map;
  }, [events]);

  const startEdit = (event) => {
    setSection('create');
    setEditingId(event.event_id);
    setForm({
      event_id: String(event.event_id),
      title: event.title,
      short_description: event.short_description,
      description: event.description,
      city: event.city,
      location: event.location,
      format: event.format,
      starts_at: event.starts_at.slice(0, 16),
      ends_at: event.ends_at.slice(0, 16),
      capacity: String(event.capacity),
      category_id: String(event.category_id),
      status: event.status,
      program: event.program,
      image_url: event.image_url || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      category_id: Number(form.category_id),
      capacity: Number(form.capacity),
      starts_at: form.starts_at.replace('T', ' '),
      ends_at: form.ends_at.replace('T', ' '),
    };

    try {
      if (editingId) {
        await eventsService.update(payload);
        setMessage({ type: 'success', title: 'Готово', message: 'Мероприятие обновлено.' });
      } else {
        await eventsService.create(payload);
        setMessage({ type: 'success', title: 'Готово', message: 'Мероприятие создано.' });
      }
      setForm(initialForm);
      setEditingId(null);
      loadBaseData();
      setSection('events');
    } catch (err) {
      setMessage({ type: 'error', title: 'Ошибка', message: err.message });
    }
  };

  const handleDelete = async () => {
    try {
      await eventsService.remove(deleteEventId);
      setDeleteEventId(null);
      setMessage({ type: 'success', title: 'Готово', message: 'Мероприятие переведено в статус cancelled.' });
      loadBaseData();
    } catch (err) {
      setDeleteEventId(null);
      setMessage({ type: 'error', title: 'Ошибка', message: err.message });
    }
  };

  return (
    <section className="page-section">
      <div className="container admin-layout">
        <AdminSidebar activeSection={section} onChange={setSection} />

        <div className="admin-content">
          {message ? <NotificationBlock {...message} /> : null}

          {(section === 'events' || section === 'create') && (
            <div className="card">
              <div className="section-kicker">Управление мероприятиями</div>
              <h1>Список мероприятий</h1>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Дата</th>
                      <th>Статус</th>
                      <th>Участники</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((item) => (
                      <tr key={item.event_id}>
                        <td>{item.title}</td>
                        <td>{formatDateTime(item.starts_at)}</td>
                        <td>{formatStatus(item.status)}</td>
                        <td>
                          {item.registrations_count}/{item.capacity}
                        </td>
                        <td className="table-actions">
                          <Button variant="ghost" type="button" onClick={() => startEdit(item)}>
                            Редактировать
                          </Button>
                          <Button variant="danger" type="button" onClick={() => setDeleteEventId(item.event_id)}>
                            Скрыть
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'create' && (
            <EventForm
              form={form}
              categories={categories}
              onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
              onSubmit={handleSubmit}
              submitText={editingId ? 'Сохранить изменения' : 'Создать мероприятие'}
            />
          )}

          {section === 'participants' && (
            <div className="card">
              <div className="section-kicker">Участники</div>
              <label className="field">
                <span className="field__label">Мероприятие</span>
                <select className="field__control" value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}>
                  {events.map((item) => (
                    <option key={item.event_id} value={item.event_id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Участник</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((item) => (
                      <tr key={item.registration_id}>
                        <td>{item.full_name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{formatStatus(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'users' && (
            <div className="card">
              <div className="section-kicker">Пользователи</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Активные регистрации</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item.student_id}>
                        <td>{item.full_name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.registrations_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'stats' && stats && (
            <div className="card">
              <div className="section-kicker">Статистика</div>
              <div className="stats-grid">
                <div className="stat-card">
                  <strong>{stats.summary.total_events}</strong>
                  <span>Всего мероприятий</span>
                </div>
                <div className="stat-card">
                  <strong>{stats.summary.published_events}</strong>
                  <span>Опубликовано</span>
                </div>
                <div className="stat-card">
                  <strong>{stats.summary.active_registrations}</strong>
                  <span>Активных регистраций</span>
                </div>
                <div className="stat-card">
                  <strong>{stats.summary.total_students}</strong>
                  <span>Пользователей</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(deleteEventId)}
        title="Подтвердите действие"
        onClose={() => setDeleteEventId(null)}
        actions={
          <>
            <Button variant="ghost" type="button" onClick={() => setDeleteEventId(null)}>
              Отмена
            </Button>
            <Button variant="danger" type="button" onClick={handleDelete}>
              Скрыть мероприятие
            </Button>
          </>
        }
      >
        <p>Мероприятие будет переведено в статус cancelled и исчезнет из публичного каталога.</p>
      </Modal>
    </section>
  );
}

export default AdminPage;
