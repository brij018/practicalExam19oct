import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  fetchBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
} from "./blogThunk";

const initialState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.blogs || [];
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.loading = false;
        const newBlog = action.payload?.blog || action.payload;
        state.blogs.unshift(newBlog);
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.blog || action.payload;
        state.blogs = state.blogs.map((item) =>
          item._id === updated._id ? updated : item,
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedBlog, clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
