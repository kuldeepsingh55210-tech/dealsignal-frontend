import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://web-production-c96b6.up.railway.app/api',
    withCredentials: true
});

// Auth
export const adminLogin = (data) => API.post('/auth/login', data);
export const adminLogout = () => API.post('/auth/logout');

// Stats
export const getStats = () => API.get('/admin/stats');

// Brokers
export const getAllBrokers = () => API.get('/admin/brokers');
export const getBrokerDetails = (id) => API.get(`/admin/brokers/${id}`);
export const updateBrokerStatus = (id, isActive) => API.patch(`/admin/brokers/${id}/status`, { isActive });
export const updateBrokerSubscription = (id, data) => API.patch(`/admin/brokers/${id}/subscription`, data);

// Leads
export const getAllLeads = (params) => API.get('/admin/leads', { params });