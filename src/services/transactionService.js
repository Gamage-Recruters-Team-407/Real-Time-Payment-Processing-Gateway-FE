// src/services/transactionService.js
//
// Uses the api.js already in this repo (axios instance with JWT interceptor
// + 401 -> /login). No mock data - calls the real backend directly.
//
// Response shape: the backend wraps every payload as
// { success, message, data } (matching AdminController.js's convention),
// so every call here unwraps response.data.data.

import api from "./api";

/**
 * Summary stats for the top cards on Payment History.
 * GET /api/transactions/summary
 */
export async function getTransactionSummary() {
  const response = await api.get("/transactions/summary");
  // Support both wrapped and direct formats
  return response.data?.data !== undefined ? response.data.data : response.data;
}

/**
 * Paginated, filterable transaction list for the Payment History table.
 * GET /api/transactions?status=&search=&page=&limit=
 *
 * @param {{ status?: string, search?: string, page?: number, limit?: number }} params
 */
export async function getTransactions(params = {}) {
  const { status = "All", search = "", page = 1, limit = 5 } = params;
  const response = await api.get("/transactions", {
    params: { status, search, page, limit },
  });
  
  // Adapt to the response structure of the test backend
  const data = response.data;
  const payload = data?.data !== undefined ? data.data : data;
  const transactions = payload.transactions || payload.results || [];
  
  return {
    transactions,
    results: transactions, // for PaymentHistory.jsx
    total: payload.total || 0,
    currentPage: payload.currentPage || page,
    totalPages: payload.totalPages || 1,
    pageSize: payload.pageSize || limit,
  };
}

/**
 * A single transaction by its human-readable Payment.transactionId
 * (e.g. "TXN-98214308").
 * GET /api/transactions/:id
 */
export async function getTransactionById(transactionId) {
  const response = await api.get(`/transactions/${transactionId}`);
  // Support both wrapped and direct formats
  return response.data?.data !== undefined ? response.data.data : response.data;
}

/**
 * The most recent transaction for the logged-in user - used by
 * PaymentSuccess.jsx when it isn't handed data directly via route state
 * from the payment flow.
 * GET /api/transactions/latest
 *
 * Until authMiddleware.js is fixed and wired in, the backend also accepts a
 * `userId` query param as a stand-in for req.user:
 *   getLatestTransaction({ userId: "..." })
 */
export async function getLatestTransaction({ userId } = {}) {
  const response = await api.get("/transactions/latest", {
    params: userId ? { userId } : {},
  });
  return response.data?.data !== undefined ? response.data.data : response.data;
}

/**
 * Downloads the PDF receipt for a transaction and saves it to the user's
 * device. The PDF is generated server-side.
 * GET /api/transactions/:id/receipt
 */
export async function downloadReceipt(transactionId) {
  const response = await api.get(`/transactions/${transactionId}/receipt`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${transactionId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ----------------------------------------------------
// Functions below are required by TransactionManagement.jsx
// ----------------------------------------------------

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