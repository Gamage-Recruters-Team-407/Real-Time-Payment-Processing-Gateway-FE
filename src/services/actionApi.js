import api from './api';

export const handleTransactionAction = async (id, actionData) => {
  // actionData: { action: 'FREEZE' | 'BLOCK' | 'RELEASE', notes, performedBy }
  const response = await api.post(`/fraud/transactions/${id}/action`, actionData);
  return response.data;
};

export const handleReviewAction = async (id, reviewData) => {
  // reviewData: { decision: 'APPROVE' | 'FLAG' | 'BLOCK', notes, performedBy }
  const response = await api.post(`/fraud/transactions/${id}/review`, reviewData);
  return response.data;
};

export const addToWhitelist = async (whitelistData) => {
  // whitelistData: { entityType, entityId, reason, performedBy, expiresAt }
  const response = await api.post('/fraud/whitelist', whitelistData);
  return response.data;
};
