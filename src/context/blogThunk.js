import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog as updateBlogApi,
  deleteBlog as deleteBlogApi,
} from "../api/blogApi";

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const data = await getBlogs();
  return data;
});

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id) => {
    const data = await getBlog(id);
    return data;
  },
);

export const addBlog = createAsyncThunk("blogs/addBlog", async (blog) => {
  const data = await createBlog(blog);
  return data;
});

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blog }) => {
    const data = await updateBlogApi(id, blog);
    return data;
  },
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  await deleteBlogApi(id);
  return id;
});
