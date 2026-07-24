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

// Métodos auxiliares para Vehicles
export const vehicleService = {
  getAllVehicles: () => vehicleApi.get('/api/vehicles'),
  getVehicleById: (id: number) => vehicleApi.get(`/api/vehicles/${id}`),
  createVehicle: (data: any) => vehicleApi.post('/api/vehicles', data),
  updateVehicle: (id: number, data: any) => vehicleApi.put(`/api/vehicles/${id}`, data),
  deleteVehicle: (id: number) => vehicleApi.delete(`/api/vehicles/${id}`),
  getAllCategories: () => vehicleApi.get('/api/categories'),
};

export default api;