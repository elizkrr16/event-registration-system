import { http } from './http';
import type { Participant, Registration } from '../types';

export const registrationsApi = {
  create: (eventId: number) => http.post<null>('/registrations/create.php', { event_id: eventId }),
  cancel: (eventId: number) => http.post<null>('/registrations/cancel.php', { event_id: eventId }),
  my: () => http.get<Registration[]>('/registrations/my.php'),
  eventParticipants: (eventId: number) =>
    http.get<Participant[]>(`/registrations/event_participants.php?event_id=${eventId}`),
};
