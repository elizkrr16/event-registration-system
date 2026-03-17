import { api } from './api';

const registrationsService = {
  create(eventId) {
    return api.post('/registrations/create.php', { event_id: eventId });
  },
  cancel(eventId) {
    return api.post('/registrations/cancel.php', { event_id: eventId });
  },
  my() {
    return api.get('/registrations/my.php');
  },
  byEvent(eventId) {
    return api.get(`/registrations/by-event.php?event_id=${eventId}`);
  },
};

export default registrationsService;
