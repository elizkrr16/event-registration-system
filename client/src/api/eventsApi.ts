import { http } from './http';
import type { EventItem, EventPayload } from '../types';

export const eventsApi = {
  list: (params?: URLSearchParams) =>
    http.get<EventItem[]>(`/events/list.php${params ? `?${params.toString()}` : ''}`),
  details: (eventId: number) => http.get<EventItem>(`/events/details.php?id=${eventId}`),
  create: (payload: EventPayload) => http.post<{ id: number }>('/events/create.php', payload),
  update: (payload: EventPayload) => http.post<null>('/events/update.php', payload),
  archive: (eventId: number) => http.post<null>('/events/delete.php', { id: eventId }),
};
