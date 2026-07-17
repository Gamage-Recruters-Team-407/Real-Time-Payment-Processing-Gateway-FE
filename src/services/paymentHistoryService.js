import api from "./api";

/**
 * Summary stats for the top cards on Dashboard.
 * GET /api/user-payment-history/summary
 */
export async function getPaymentSummary() {
  const response = await api.get("/user-payment-history/summary");
  return response.data?.data !== undefined ? response.data.data : response.data;
}

/**
 * Paginated, search-filtered payment transactions list.
 * GET /api/user-payment-history?status=&search=&page=&limit=
 */
export async function getPaymentHistory(params = {}) {
  const { status = "", search = "", page = 1, limit = 5, month = "" } = params;
  const response = await api.get("/user-payment-history", {
    params: { status, search, page, limit, month },
  });
  return response.data?.data !== undefined ? response.data.data : response.data;
}
