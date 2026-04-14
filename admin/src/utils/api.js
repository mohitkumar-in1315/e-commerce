import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export const api = {
  // Auth
  login: (data) => axios.post(`${API_URL}/admin/login`, data),

  // Stats
  getStats: () => axios.get(`${API_URL}/admin/stats`, { headers: getAuthHeaders() }),

  // Foods
  getFoods: () => axios.get(`${API_URL}/admin/foods`, { headers: getAuthHeaders() }),
  addFood: (formData) => axios.post(`${API_URL}/admin/foods`, formData, { headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } }),
  updateFood: (id, formData) => axios.put(`${API_URL}/admin/foods/${id}`, formData, { headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } }),
  deleteFood: (id) => axios.delete(`${API_URL}/admin/foods/${id}`, { headers: getAuthHeaders() }),

  // Orders
  getOrders: () => axios.get(`${API_URL}/admin/orders`, { headers: getAuthHeaders() }),
  updateOrderStatus: (id, status) => axios.put(`${API_URL}/admin/orders/${id}/status`, { status }, { headers: getAuthHeaders() }),

  // Users
  getUsers: () => axios.get(`${API_URL}/admin/users`, { headers: getAuthHeaders() }),
  deleteUser: (id) => axios.delete(`${API_URL}/admin/users/${id}`, { headers: getAuthHeaders() }),
};

export const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  // Uploaded images served from backend
  if (/^\d+\.\w+$/.test(image)) return `http://localhost:4000/uploads/${image}`;
  // Seeded food images — use vite asset import trick via public folder reference
  return `http://localhost:5173/src/assets/${image}`;
};
