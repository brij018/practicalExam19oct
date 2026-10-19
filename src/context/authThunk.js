import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../api/authApi";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials) => {
  const data = await login(credentials);
  return data;
});

export const registerUser = createAsyncThunk("auth/registerUser", async (userData) => {
  const data = await register(userData);
  return data;
});
