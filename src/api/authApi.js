import api from './axios';

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const verifyOTP = (data) => api.post('/auth/verify-otp', data);
