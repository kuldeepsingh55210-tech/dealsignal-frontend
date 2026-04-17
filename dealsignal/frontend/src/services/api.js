import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.dispatchEvent(new Event('unauthorized'));
        }
        // ✅ 403 = Subscription expired
        if (error.response && error.response.status === 403) {
            window.dispatchEvent(new Event('subscription_expired'));
        }
        return Promise.reject(error);
    }
);

export default api;