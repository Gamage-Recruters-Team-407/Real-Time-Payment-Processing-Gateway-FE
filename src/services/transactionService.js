import api from "./api";

export const getTransactions = (params = {}) => {
  return api.get("/transactions", { params }).then((response) => response.data);
};

export const getTransactionById = (id) => {
  return api.get(`/transactions/${id}`).then((response) => response.data);
};

export const createTransaction = (payload) => {
  return api.post("/transactions", payload).then((response) => response.data);
};

export const updateTransactionStatus = (id, payload) => {
  return api.put(`/transactions/${id}/status`, payload).then((response) => response.data);
};

export const exportTransactions = (params = {}) => {
  return api.get("/transactions/export", {
    params,
    responseType: "blob",
  });
};
