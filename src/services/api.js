import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL - Your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // ✅ Successfully handle ALL 2xx responses (200, 201, 204, etc.)
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // ✅ Avoid redirect loop - only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;