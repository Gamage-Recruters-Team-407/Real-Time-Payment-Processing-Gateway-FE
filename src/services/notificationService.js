import api from "./api";

// filter: "all" | "unread" | "payment_success,payment_failed,settlement" | "security,otp"
export const getNotifications = async (filter = "all") => {
  const { data } = await api.get("/notifications", { params: { filter } });
  return data.data; // array of notifications, already formatted by the backend
};

export const getUnreadCount = async () => {
  const { data } = await api.get("/notifications/unread-count");
  return data.data.count;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.patch("/notifications/read-all");
  return data.data.modifiedCount;
};

export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};
