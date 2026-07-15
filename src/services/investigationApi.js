import api from './api';

export const startInvestigation = async (alertId, data) => {
  // data: { assignedTo, priority, notes }
  const response = await api.post(`/fraud/alerts/${alertId}/investigate`, data);
  return response.data;
};

export const getInvestigationDetails = async (caseId) => {
  const response = await api.get(`/fraud/investigation/${caseId}`);
  return response.data;
};

export const addInvestigationNote = async (caseId, data) => {
  // data: { content, analyst }
  const response = await api.post(`/fraud/investigation/${caseId}/note`, data);
  return response.data;
};

export const handleInvestigationAction = async (caseId, data) => {
  // data: { action: 'APPROVE' | 'BLOCK' | 'ESCALATE' | 'CLOSE', reason, performedBy, notes }
  const response = await api.post(`/fraud/investigation/${caseId}/action`, data);
  return response.data;
};
