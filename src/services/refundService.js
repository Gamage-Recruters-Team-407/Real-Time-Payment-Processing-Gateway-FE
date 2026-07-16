import api from "./api";

// GET ALL REFUNDS
export const getAllRefunds = async () => {
  return await api.get("/refunds/all");
};

// GET SINGLE REFUND
export const getRefundById = async (id) => {
  return await api.get(`/refunds/${id}`);
};

// APPROVE REFUND
export const approveRefund = async (id) => {
  return await api.put(`/refunds/${id}/approve`);
};

// REJECT REFUND
export const rejectRefund = async (id) => {
  return await api.put(`/refunds/${id}/reject`);
};

// MARK AS REFUNDED
export const refundPayment = async (id) => {
  return await api.put(`/refunds/${id}/refund`);
};

// DELETE REFUND
export const deleteRefund = async (id) => {
  return await api.delete(`/refunds/${id}`);
};