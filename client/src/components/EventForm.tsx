import { useEffect, useState } from 'react';
import type { Category, EventPayload } from '../types';

const initialState: EventPayload = {
  title: '',
  short_description: '',
  description: '',
  location: '',
  event_date: '',
  capacity: 30,
  category_id: 1,
  status: 'draft',
};

export function EventForm({
  categories,
  initialValue,
  onSubmit,
  saving,
}: {
  categories: Category[];
  initialValue?: EventPayload;
  onSubmit: (payload: EventPayload) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<EventPayload>(initialValue ?? initialState);

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
    }
  }, [initialValue]);

  return (
    <form
      className="panel panel--padded form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
    >
      <div className="field">
        <label htmlFor="title">Название</label>
        <input
          id="title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="short_description">Краткое описание</label>
        <input
          id="short_description"
          value={form.short_description}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, short_description: event.target.value }))
          }
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Полное описание</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          required
        />
      </div>

      <div className="filters">
        <div className="field">
          <label htmlFor="location">Место</label>
          <input
            id="location"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="event_date">Дата и время</label>
          <input
            id="event_date"
            type="datetime-local"
            value={form.event_date}
            onChange={(event) => setForm((prev) => ({ ...prev, event_date: event.target.value }))}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="capacity">Вместимость</label>
          <input
            id="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, capacity: Number(event.target.value) }))
            }
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={form.category_id}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category_id: Number(event.target.value) }))
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                status: event.target.value as EventPayload['status'],
              }))
            }
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
            <option value="closed">Закрыто</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </div>

      <button className="primary-button" type="submit" disabled={saving}>
        {saving ? 'Сохранение...' : 'Сохранить мероприятие'}
      </button>
    </form>
  );
}
