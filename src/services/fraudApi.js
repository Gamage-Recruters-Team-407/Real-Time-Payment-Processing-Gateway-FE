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
