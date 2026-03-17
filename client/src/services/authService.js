import { api } from './api';

const authService = {
  me: () => api.get('/auth/me.php'),
  login: (payload) => api.post('/auth/login.php', payload),
  register: (payload) => api.post('/auth/register.php', payload),
  logout: () => api.post('/auth/logout.php'),
};

export default authService;
