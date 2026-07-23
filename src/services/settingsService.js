import api from "./api";

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const updateSettings = async (updatePayload) => {
  const { data } = await api.put("/settings", updatePayload);
  return data;
};

export const updatePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put("/settings/password", { currentPassword, newPassword });
  return data;
};

export const sendResetLink = async (recoveryEmail) => {
  const { data } = await api.post("/settings/reset-link", { recoveryEmail });
  return data;
};
