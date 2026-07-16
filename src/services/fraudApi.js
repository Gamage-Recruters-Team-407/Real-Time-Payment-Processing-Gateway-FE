import api from './api';

export const getDashboardMetrics = async () => {
  const response = await api.get('/fraud/dashboard');
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/fraud/alerts');
  return response.data;
};

export const getAlertById = async (id) => {
  const response = await api.get(`/fraud/alerts/${id}`);
  return response.data;
};

export const getTransactions = async (params) => {
  const response = await api.get('/fraud/transactions', { params });
  return response.data;
};

export const getEntityLinkData = async (id) => {
  const response = await api.get(`/fraud/entity-link/${id}`);
  return response.data;
};

export const getRegionalVelocity = async () => {
  const response = await api.get('/fraud/regional-velocity');
  return response.data;
};

export const handleTransactionAction = async (id, data) => {
  // data: { action: 'FREEZE' | 'BLOCK' | 'RELEASE', notes, performedBy }
  const response = await api.post(`/fraud/transactions/${id}/action`, data);
  return response.data;
};

export const addToWhitelist = async (data) => {
  // data: { entityType, entityId, reason, expiresAt, performedBy }
  const response = await api.post('/fraud/whitelist', data);
  return response.data;
};

export const runLivePrediction = async (id) => {
  const response = await api.get(`/fraud/predict/${id}`);
  return response.data;
};
