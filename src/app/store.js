import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../context/blogSlice";
import authReducer from "../context/authSlice";

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    auth: authReducer,
  },
});

export default store;
