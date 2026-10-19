import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../context/blogThunk";
import { getCurrentUserId, getBlogOwnerId } from "../utils/owner";
import { logout } from "../api/authApi";
import { logoutUser } from "../context/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogs.length]);

  // Filter only current user's posts
  const myBlogs = currentUserId
    ? blogs.filter((b) => String(getBlogOwnerId(b)) === String(currentUserId))
    : [];

  const userAuthorName =
    myBlogs[0]?.author?.name ||
    (typeof myBlogs[0]?.author === "string" ? myBlogs[0].author : "Author");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  const handleSignOut = () => {
    logout();
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="container my-5">
      {/* Profile Card Header */}
      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "70px", height: "70px", fontSize: "1.8rem" }}
              >
                <i className="bi bi-person"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-1">{userAuthorName}</h3>
                <p className="text-muted mb-0 small">
                  User ID: <span className="font-monospace">{currentUserId || "N/A"}</span>
                </p>
                <span className="badge bg-primary-subtle text-primary border mt-2">
                  {myBlogs.length} {myBlogs.length === 1 ? "Post Published" : "Posts Published"}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to="/create" className="btn btn-primary btn-sm">
                <i className="bi bi-pencil-square me-1"></i>New Blog
              </Link>
              <button className="btn btn-outline-danger btn-sm" onClick={handleSignOut}>
                <i className="bi bi-box-arrow-right me-1"></i>Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User's Blogs */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">My Published Blogs</h4>
        <span className="text-muted small">Total: {myBlogs.length}</span>
      </div>

      {loading && <p className="text-muted">Loading your blogs...</p>}

      {!loading && myBlogs.length === 0 && (
        <div className="text-center py-5 bg-white border rounded">
          <i className="bi bi-journal-plus display-4 text-muted mb-3 d-block"></i>
          <h5>You haven't written any blogs yet</h5>
          <p className="text-muted">Start creating and sharing your stories today.</p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      )}

      {!loading && myBlogs.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {myBlogs.map((blog) => {
            const id = blog._id || blog.id;
            return (
              <div className="col" key={id}>
                <div className="card h-100 shadow-sm border-0">
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-secondary mb-2 align-self-start">
                      {blog.category || "General"}
                    </span>
                    <h5 className="card-title text-truncate">{blog.title}</h5>
                    <p className="card-text text-muted small text-truncate">
                      {blog.body}
                    </p>
                    <p className="card-text small text-muted mb-3">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : ""}
                    </p>

                    <div className="mt-auto d-flex gap-2">
                      <Link
                        to={`/blogs/${id}`}
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit-blog/${id}`}
                        className="btn btn-outline-warning btn-sm"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
