import axios from 'axios';
import toast from 'react-hot-toast';

// ================================
// 🌐 Backend URL for Production
// ================================
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://shop-ease-backend-production.up.railway.app';
// 🔥 Replace with your exact Railway backend domain

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// =================================
// 🔐 Request Interceptor
// Adds JWT token automatically
// =================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =================================
// ❗ Response Interceptor
// Handles 401 (Expired session)
// =================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Token expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
