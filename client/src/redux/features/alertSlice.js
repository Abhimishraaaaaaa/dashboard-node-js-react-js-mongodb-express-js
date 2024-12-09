import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alerts",
  initialState: {
    loading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false; // Corrected to false
    },
  },
});

export const { showLoading, hideLoading } = alertSlice.actions;
