import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Apontando para o Gateway
});

// Interceptor para injetar o Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});