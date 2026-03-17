import { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { eventsApi } from '../api/eventsApi';
import { EventCard } from '../components/EventCard';
import { StatusBanner } from '../components/StatusBanner';
import type { Category, EventItem } from '../types';

export function EventsCatalogPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (search.trim()) {
        params.set('search', search.trim());
      }
      if (categoryId) {
        params.set('category_id', categoryId);
      }

      const [eventList, categoryList] = await Promise.all([
        eventsApi.list(params),
        adminApi.categories(),
      ]);

      setEvents(eventList);
      setCategories(categoryList);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить каталог.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="toolbar">
          <div>
            <div className="section-subtitle">Каталог мероприятий</div>
            <h1>Актуальные события</h1>
            <p className="section-description">
              Здесь отображаются опубликованные мероприятия с поиском и фильтрацией по категориям.
            </p>
          </div>
          <button className="ghost-button" type="button" onClick={() => void loadData()}>
            Обновить
          </button>
        </div>

        {error && <StatusBanner tone="error" message={error} />}

        <div className="panel panel--padded filters" style={{ marginBottom: '20px' }}>
          <div className="field">
            <label htmlFor="search">Поиск</label>
            <input
              id="search"
              placeholder="Например, хакатон или форум"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="card-actions">
            <button className="primary-button" type="button" onClick={() => void loadData()}>
              Применить
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryId('');
                void loadData();
              }}
            >
              Сбросить
            </button>
          </div>
        </div>

        {loading ? <div className="empty-state">Загрузка мероприятий...</div> : null}

        {!loading && events.length === 0 ? (
          <div className="empty-state">
            Мероприятия пока не опубликованы или не найдены по заданным фильтрам.
          </div>
        ) : null}

        {!loading && events.length > 0 ? (
          <div className="cards-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
