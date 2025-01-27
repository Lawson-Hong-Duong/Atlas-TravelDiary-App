import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers['x-auth-token'] = token;
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
