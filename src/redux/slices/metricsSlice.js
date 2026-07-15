import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardMetrics } from '../../services/fraudApi';

export const fetchMetrics = createAsyncThunk('metrics/fetchMetrics', async () => {
  const data = await getDashboardMetrics();
  return data;
});

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    data: {
      totalAlerts: 0,
      blockedTransactions: 0,
      highRiskEntities: 0,
      pendingInvestigations: 0
    },
    loading: false,
    error: null,
  },
  reducers: {
    updateMetrics: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => { state.loading = true; })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
