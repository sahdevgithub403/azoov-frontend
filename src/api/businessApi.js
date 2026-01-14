import api from './axios';

export const getBusiness = () => api.get('/business');
export const updateBusiness = (data) => api.put('/business', data);

