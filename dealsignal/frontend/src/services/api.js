import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Important for cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (e.g. redirect to login)
        if (error.response && error.response.status === 401) {
            // Optional: clear local state or trigger logout action
            window.dispatchEvent(new Event('unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;
