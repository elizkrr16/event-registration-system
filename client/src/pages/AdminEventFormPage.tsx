import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { eventsApi } from '../api/eventsApi';
import { EventForm } from '../components/EventForm';
import { StatusBanner } from '../components/StatusBanner';
import type { Category, EventPayload } from '../types';

export function AdminEventFormPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEdit = Boolean(eventId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialValue, setInitialValue] = useState<EventPayload | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryList = await adminApi.categories();
        setCategories(categoryList);

        if (eventId) {
          const event = await eventsApi.details(Number(eventId));
          setInitialValue({
            id: event.id,
            title: event.title,
            short_description: event.short_description,
            description: event.description,
            location: event.location,
            event_date: event.event_date.slice(0, 16),
            capacity: event.capacity,
            category_id: event.category_id || categoryList[0]?.id || 1,
            status: event.status,
          });
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Не удалось загрузить форму.');
      }
    };

    void loadData();
  }, [eventId]);

  const handleSubmit = async (payload: EventPayload) => {
    setSaving(true);
    setMessage('');

    try {
      if (isEdit) {
        await eventsApi.update(payload);
      } else {
        await eventsApi.create(payload);
      }
      navigate('/admin/events');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить мероприятие.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-subtitle">Администратор</div>
        <h1>{isEdit ? 'Редактирование мероприятия' : 'Создание мероприятия'}</h1>
        <p className="section-description">
          Управление карточкой события, статусом публикации, категорией и вместимостью.
        </p>

        {message && <StatusBanner tone="error" message={message} />}

        {categories.length > 0 ? (
          <EventForm
            categories={categories}
            initialValue={initialValue}
            onSubmit={handleSubmit}
            saving={saving}
          />
        ) : (
          <div className="empty-state">Загрузка категорий...</div>
        )}
      </div>
    </section>
  );
}
