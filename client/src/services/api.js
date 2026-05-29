import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cortex_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/me');
    if (error.response?.status === 401 && !isAuthRoute) {
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

export const downloadReport = async (analysisId) => {
  const token = localStorage.getItem('cortex_token');
  const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
  const response = await fetch(`${baseUrl}/report/${analysisId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to generate PDF');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cortexai-report-${analysisId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
