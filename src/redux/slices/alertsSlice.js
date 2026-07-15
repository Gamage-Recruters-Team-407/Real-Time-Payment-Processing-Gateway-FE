import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAlerts } from '../../services/fraudApi';

export const fetchAlerts = createAsyncThunk('alerts/fetchAlerts', async () => {
  const data = await getAlerts();
  return data.alerts || data.transactions || data;
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addAlert: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateAlert: (state, action) => {
      const index = state.items.findIndex(a => a._id === action.payload._id || a.transactionId === action.payload.transactionId);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeAlert: (state, action) => {
      state.items = state.items.filter(a => a._id !== action.payload && a.transactionId !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => { state.loading = true; })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addAlert, updateAlert, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
