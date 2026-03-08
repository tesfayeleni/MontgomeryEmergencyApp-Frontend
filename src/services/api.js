import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),
  
  // login: (email, password) =>
  //   api.post('/auth/login', { email, password }),
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);  // OAuth2 uses 'username' not 'email'
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

export const intelligenceService = {
  getForecast: () =>
    api.get('/api/forecast'),
  
  getRiskScores: () =>
    api.get('/api/risk'),
  
  getSignals: () =>
    api.get('/api/signals'),
  
  runAgents: () =>
    api.post('/api/run-agents'),

  getResourceRecommendations: () =>
    api.get('/api/resource-recommendations'),
};

export const citizenService = {
  submitReport: (reportData) =>
    api.post('/citizen/report', reportData),
  
  submitEvent: (eventData) =>
    api.post('/citizen/event', eventData),
  
  getPublicFeed: () =>
    api.get('/citizen/public-feed'),
};

export const zoneService = {
  getZones: () =>
    api.get('/zones/'),
  
  getZoneDetail: (zoneId) =>
    api.get(`/zones/${zoneId}`),
};

export const dataIngestionService = {
  triggerIngestion: () =>
    api.post('/data-ingestion/ingest-brightdata'),
};

export default api;
