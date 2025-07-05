import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Tasks
  tasks: '/tasks/',
  taskStats: '/tasks/stats/',
  taskAISuggestions: '/tasks/ai_suggestions/',
  
  // Categories
  categories: '/categories/',
  createDefaultCategories: '/categories/create_defaults/',
  
  // Context
  context: '/context/',
  
  // User
  userMe: '/users/me/',
};

// API functions
export const apiService = {
  // Tasks
  getTasks: (params?: any) => api.get(endpoints.tasks, { params }),
  createTask: (data: any) => api.post(endpoints.tasks, data),
  updateTask: (id: string, data: any) => api.patch(`${endpoints.tasks}${id}/`, data),
  deleteTask: (id: string) => api.delete(`${endpoints.tasks}${id}/`),
  toggleTaskStatus: (id: string) => api.patch(`${endpoints.tasks}${id}/toggle_status/`),
  getTaskStats: () => api.get(endpoints.taskStats),
  getAISuggestions: (data: any) => api.post(endpoints.taskAISuggestions, data),
  
  // Categories
  getCategories: () => api.get(endpoints.categories),
  createCategory: (data: any) => api.post(endpoints.categories, data),
  updateCategory: (id: string, data: any) => api.patch(`${endpoints.categories}${id}/`, data),
  deleteCategory: (id: string) => api.delete(`${endpoints.categories}${id}/`),
  createDefaultCategories: () => api.post(endpoints.createDefaultCategories),
  
  // Context
  getContextEntries: () => api.get(endpoints.context),
  createContextEntry: (data: any) => api.post(endpoints.context, data),
  processContext: (id: string) => api.post(`${endpoints.context}${id}/process/`),
  
  // User
  getCurrentUser: () => api.get(endpoints.userMe),
};