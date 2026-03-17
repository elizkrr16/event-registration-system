export type UserRole = 'guest' | 'student' | 'admin';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: Exclude<UserRole, 'guest'>;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Registration {
  id: number;
  status: 'registered' | 'cancelled';
  registered_at: string;
  event_id: number;
  title: string;
  short_description: string;
  location: string;
  event_date: string;
  event_status: 'draft' | 'published' | 'closed' | 'cancelled';
  category_name: string;
}

export interface EventItem {
  id: number;
  title: string;
  short_description: string;
  description: string;
  location: string;
  event_date: string;
  capacity: number;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  category_name: string;
  organizer_name: string;
  registrations_count: number;
  category_id?: number;
  organizer_id?: number;
  current_user_registration?: { id: number; status: string } | null;
}

export interface Participant {
  id: number;
  status: string;
  registered_at: string;
  student_id: number;
  full_name: string;
  email: string;
  group_name: string | null;
  phone: string | null;
  is_present: boolean | null;
}

export interface StatsResponse {
  summary: {
    total_events: number;
    total_registrations: number;
    total_students: number;
  };
  events: Array<{
    id: number;
    title: string;
    status: string;
    capacity: number;
    registrations_count: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface EventPayload {
  id?: number;
  title: string;
  short_description: string;
  description: string;
  location: string;
  event_date: string;
  capacity: number;
  category_id: number;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
}
