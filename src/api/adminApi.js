import api from './axios';

export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getUsers = () => api.get('/admin/users');
export const toggleUserRole = (id) => api.put(`/admin/users/${id}/role`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
