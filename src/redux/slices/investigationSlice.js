import { createSlice } from '@reduxjs/toolkit';

const investigationSlice = createSlice({
  name: 'investigation',
  initialState: {
    currentCase: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentCase: (state, action) => {
      state.currentCase = action.payload;
    },
    clearCurrentCase: (state) => {
      state.currentCase = null;
    }
  }
});

export const { setCurrentCase, clearCurrentCase } = investigationSlice.actions;
export default investigationSlice.reducer;
