import { api } from './api';

const adminService = {
  categories() {
    return api.get('/admin/categories.php');
  },
  stats() {
    return api.get('/admin/stats.php');
  },
  users() {
    return api.get('/admin/users.php');
  },
};

export default adminService;
