import { http } from './http';
import type { User } from '../types';

export const authApi = {
  me: () => http.get<User | null>('/auth/me.php'),
  login: (payload: { email: string; password: string }) =>
    http.post<User>('/auth/login.php', payload),
  register: (payload: {
    full_name: string;
    email: string;
    password: string;
    group_name: string;
    phone: string;
  }) => http.post<User>('/auth/register.php', payload),
  logout: () => http.post<null>('/auth/logout.php'),
};
