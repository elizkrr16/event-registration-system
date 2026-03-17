import { api } from './api';

const eventsService = {
  list(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        search.set(key, value);
      }
    });
    const suffix = search.toString() ? `?${search.toString()}` : '';
    return api.get(`/events/list.php${suffix}`);
  },
  details(eventId) {
    return api.get(`/events/details.php?id=${eventId}`);
  },
  create(payload) {
    return api.post('/events/create.php', payload);
  },
  update(payload) {
    return api.post('/events/update.php', payload);
  },
  remove(eventId) {
    return api.post('/events/delete.php', { event_id: eventId });
  },
};

export default eventsService;
