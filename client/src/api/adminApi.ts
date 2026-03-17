import { http } from './http';
import type { Category, StatsResponse } from '../types';

export const adminApi = {
  categories: () => http.get<Category[]>('/admin/categories.php'),
  stats: () => http.get<StatsResponse>('/admin/stats.php'),
};
