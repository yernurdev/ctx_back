import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cortex_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cortex_token');
      localStorage.removeItem('cortex_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const getMe = () => api.get('/auth/me');

// ── Analysis ──────────────────────────────────────────────────
export const uploadAnalysis = (donorFile, recipientFile) => {
  const fd = new FormData();
  fd.append('donorFile', donorFile);
  fd.append('recipientFile', recipientFile);
  return api.post('/analysis/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getHistory = () => api.get('/analysis/history');
export const getAnalysis = (id) => api.get(`/analysis/${id}`);
