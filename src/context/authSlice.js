import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authThunk";
import { logout } from "../api/authApi";

const initialState = {
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      logout();
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.token || localStorage.getItem("token");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
