import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401) and forbidden errors (403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        console.error('Authentication failed. Please log in again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
