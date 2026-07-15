import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from './slices/alertsSlice';
import investigationReducer from './slices/investigationSlice';
import metricsReducer from './slices/metricsSlice';

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    investigation: investigationReducer,
    metrics: metricsReducer,
  },
});
