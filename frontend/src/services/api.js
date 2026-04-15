import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const getModels = () => api.get('/models');
export const getMetrics = () => api.get('/metrics');
export const getConfusionMatrix = () => api.get('/confusion-matrix');
export const getRocData = () => api.get('/roc-data');
export const getFeatureImportance = () => api.get('/feature-importance');
export const postPredict = (data) => api.post('/predict', data);

export default api;
