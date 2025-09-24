import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:8081';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test connection to the backend
export const testConnection = async () => {
  try {
    const response = await api.get('/api/users/test');
    return response.data;
  } catch (error) {
    console.error('API test error:', error);
    throw error;
  }
};

// User login
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// User signup
export const signup = async (userData) => {
  try {
    const response = await api.post('/api/users/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export default api;
