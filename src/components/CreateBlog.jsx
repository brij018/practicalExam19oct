import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBlog } from "../api/blogApi";
import { uploadFiles } from "../api/mediaApi";
import { fetchBlogs } from "../context/blogThunk";
import BlogForm from "./BlogForm";

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (blog) => {
    try {
      setLoading(true);
      setMessage("");

      let uploadedMedia = [];
      if (blog.mediaFiles && blog.mediaFiles.length > 0) {
        uploadedMedia = await uploadFiles(blog.mediaFiles);
      }

      const coverImage =
        uploadedMedia.find((item) => item.resourceType === "image")?.url ||
        blog.coverImage ||
        "";

      await createBlog({
        title: blog.title,
        category: blog.category,
        body: blog.body,
        coverImage,
        media: uploadedMedia,
      });

      // Refresh blogs in redux
      dispatch(fetchBlogs());
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Failed to create blog."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Create New Post</h2>
          <p className="text-muted">Share your thoughts with the community</p>
        </div>
        <Link to="/" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>Back Home
        </Link>
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <BlogForm loading={loading} submitLabel="Publish Blog" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
