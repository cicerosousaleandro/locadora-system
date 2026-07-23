import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
});

export const vehicleApi = axios.create({
  baseURL: 'http://localhost:8082',
});

const setupInterceptors = (instance: any) => {
  instance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error: any) => {
    return Promise.reject(error);
  });
};

setupInterceptors(api);
setupInterceptors(vehicleApi);

export default api;