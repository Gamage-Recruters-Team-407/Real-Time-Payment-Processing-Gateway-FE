import api from './api';

export const fetchUsers = async ({ page = 1, limit = 6, search = '', role = '' } = {}) => {
  const response = await api.get('/users', {
    params: {
      page,
      limit,
      search,
      role,
    },
  });

  const payload = response.data || {};

  return {
    users: payload.items || [],
    total: Number(payload.total || 0),
    page: Number(payload.page || page),
    pages: Number(payload.pages || 1),
  };
};

export const createUser = async (payload) => {
  const response = await api.post('/users', payload);
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const normalizeRoleValue = (value) => {
  const normalized = String(value || '').trim().toLowerCase();

  if (normalized === 'admin') return 'admin';
  if (normalized === 'user') return 'user';

  return normalized || 'user';
};

export const getRoleLabel = (value) => {
  const normalized = String(value || '').trim().toLowerCase();

  switch (normalized) {
    case 'admin':
      return 'Admin';
    case 'user':
      return 'User';
    default:
      return value || 'User';
  }
};
