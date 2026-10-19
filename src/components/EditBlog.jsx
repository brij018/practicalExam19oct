import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getBlog, updateBlog } from "../api/blogApi";
import { uploadFiles } from "../api/mediaApi";
import { isBlogOwner } from "../utils/owner";
import { fetchBlogs } from "../context/blogThunk";
import BlogForm from "./BlogForm";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blog, setBlog] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setPageLoading(true);
        const data = await getBlog(id);
        const post = data.blog || data;
        setBlog(post);

        // Security check: verify if the current user is the owner
        if (!isBlogOwner(post)) {
          setMessage("You do not have permission to edit this post.");
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load blog.");
      } finally {
        setPageLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setMessage("");

      let uploadedMedia = [];
      if (values.mediaFiles && values.mediaFiles.length > 0) {
        uploadedMedia = await uploadFiles(values.mediaFiles);
      }

      const media = [...(values.media || []), ...uploadedMedia];
      const coverImage =
        uploadedMedia.find((item) => item.resourceType === "image")?.url ||
        values.coverImage;

      await updateBlog(id, {
        title: values.title,
        category: values.category,
        body: values.body,
        coverImage,
        media,
      });

      dispatch(fetchBlogs());
      navigate(`/blogs/${id}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Failed to update blog."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading post details...</p>
      </div>
    );
  }

  // If user is not the owner
  if (blog && !isBlogOwner(blog)) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You can only edit your own blog posts.</p>
          <Link to="/" className="btn btn-primary mt-2">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Edit Blog Post</h2>
          <p className="text-muted">Update your post content and media</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {blog && (
            <BlogForm
              initialValues={blog}
              loading={loading}
              submitLabel="Save Changes"
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
