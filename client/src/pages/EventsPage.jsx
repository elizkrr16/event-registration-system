import { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import eventsService from '../services/eventsService';
import EventCard from '../components/EventCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import NotificationBlock from '../components/NotificationBlock';
import Button from '../components/Button';

const initialFilters = {
  search: '',
  date: '',
  category_id: '',
  format: '',
  city: '',
  tab: 'upcoming',
};

function EventsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEvents = async (nextFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const data = await eventsService.list(nextFilters);
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminService.categories().then(setCategories).catch(() => setCategories([]));
    loadEvents(initialFilters);
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="page-section">
      <div className="container catalog-layout">
        <FilterSidebar
          filters={filters}
          categories={categories}
          onChange={handleChange}
          onReset={() => {
            setFilters(initialFilters);
            loadEvents(initialFilters);
          }}
          onSubmit={() => loadEvents(filters)}
        />

        <div className="catalog-main">
          <div className="catalog-top">
            <div>
              <div className="section-kicker">Каталог мероприятий</div>
              <h1>Подберите подходящее событие</h1>
            </div>

            <div className="catalog-tabs">
              <Button
                type="button"
                variant={filters.tab === 'upcoming' ? 'primary' : 'ghost'}
                onClick={() => {
                  const next = { ...filters, tab: 'upcoming' };
                  setFilters(next);
                  loadEvents(next);
                }}
              >
                Ближайшие
              </Button>
              <Button
                type="button"
                variant={filters.tab === 'all' ? 'primary' : 'ghost'}
                onClick={() => {
                  const next = { ...filters, tab: 'all' };
                  setFilters(next);
                  loadEvents(next);
                }}
              >
                Все мероприятия
              </Button>
            </div>
          </div>

          <SearchBar value={filters.search} onChange={(value) => handleChange('search', value)} onSubmit={() => loadEvents(filters)} />

          {error ? <NotificationBlock type="error" title="Ошибка" message={error} /> : null}
          {loading ? <div className="card">Загрузка мероприятий...</div> : null}
          {!loading && events.length === 0 ? <div className="card">По вашему запросу мероприятий не найдено.</div> : null}

          <div className="cards-grid">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventsPage;
