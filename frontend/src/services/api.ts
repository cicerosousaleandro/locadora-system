import axios from 'axios';

// API do IAM Service (autenticação e usuários)
const api = axios.create({
  baseURL: 'http://localhost:8081',
});

// API do Vehicle Service (veículos e categorias)
export const vehicleApi = axios.create({
  baseURL: 'http://localhost:8082',
});

// Interceptor para IAM Service
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para Vehicle Service
vehicleApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;