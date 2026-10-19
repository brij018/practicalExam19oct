import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getBlog, deleteBlog } from "../api/blogApi";
import { isBlogOwner } from "../utils/owner";
import { getPrimaryCover, getBlogMedia } from "../utils/media";
import { fetchBlogs } from "../context/blogThunk";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blog, setBlog] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlog(id);
        setBlog(data.blog || data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      setDeleting(true);
      await deleteBlog(id);
      dispatch(fetchBlogs());
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete blog.");
    } finally {
      setDeleting(false);
    }
  };

  const primaryCover = getPrimaryCover(blog || {});
  const mediaList = getBlogMedia(blog || {});
  const restMedia = mediaList.filter(
    (item) => item.url && item.url !== primaryCover
  );
  const authorName =
    blog?.author?.name ||
    (typeof blog?.author === "string" ? blog?.author : "Unknown");
  const dateStr = blog?.createdAt || blog?.date;
  const isOwner = isBlogOwner(blog);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Home
        </Link>
        {isOwner && (
          <div className="d-flex gap-2">
            <Link to={`/edit-blog/${id}`} className="btn btn-warning btn-sm">
              <i className="bi bi-pencil me-1"></i>Edit
            </Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <i className="bi bi-trash me-1"></i>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      {blog && (
        <article className="card shadow-sm border p-4">
          <div className="mb-3">
            <span className="badge bg-primary mb-2">
              {blog.category || "General"}
            </span>
            <h1 className="fw-bold mb-2">{blog.title}</h1>
            <p className="text-muted small">
              By <strong>{authorName}</strong> &bull;{" "}
              {dateStr ? new Date(dateStr).toLocaleDateString() : ""}
            </p>
          </div>

          {primaryCover && (
            <div className="mb-4 text-center">
              <img
                src={primaryCover}
                alt={blog.title}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "450px", width: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          <div
            className="blog-content mb-4 fs-5"
            style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}
          >
            {blog.body || blog.content}
          </div>

          {restMedia.length > 0 && (
            <div className="mt-4 pt-3 border-top">
              <h5 className="fw-bold mb-3">Additional Media</h5>
              <div className="row g-3">
                {restMedia.map((item, idx) => (
                  <div className="col-12 col-md-6" key={item._id || idx}>
                    {item.resourceType === "video" ? (
                      <video
                        src={item.url}
                        controls
                        className="w-100 rounded"
                        style={{ maxHeight: "300px" }}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt="attachment"
                        className="img-fluid rounded"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  );
};

export default BlogDetails;
