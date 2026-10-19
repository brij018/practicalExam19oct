import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../context/blogThunk";
import { isBlogOwner } from "../utils/owner";

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  const [blogQuery, setBlogQuery] = useState({
    title: "",
    category: "all",
    author: "all",
    sort: "",
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleChange = (e) => {
    setBlogQuery((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const filterList = blogs
    .filter((b) =>
      b.title.toLowerCase().includes(blogQuery.title.toLowerCase()),
    )
    .filter((b) =>
      blogQuery.category === "all" ? true : b.category === blogQuery.category,
    )
    .filter((b) => {
      if (blogQuery.author === "all") return true;
      const authorName = b.author?.name || b.author;
      return authorName === blogQuery.author;
    });

  const sortedList = [...filterList].sort((a, b) => {
    if (blogQuery.sort === "dateAsc") {
      return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
    }
    if (blogQuery.sort === "dateDesc") {
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    }
    if (blogQuery.sort === "popAsc") {
      const popA = a.views || (Array.isArray(a.likes) ? a.likes.length : 0);
      const popB = b.views || (Array.isArray(b.likes) ? b.likes.length : 0);
      return popA - popB;
    }
    if (blogQuery.sort === "popDesc") {
      const popA = a.views || (Array.isArray(a.likes) ? a.likes.length : 0);
      const popB = b.views || (Array.isArray(b.likes) ? b.likes.length : 0);
      return popB - popA;
    }
    return 0;
  });

  const token = localStorage.getItem("token");

  const handleDelete = (id) => {
    if (!token) {
      alert("You must be logged in to delete a blog post.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  const categories = [...new Set(blogs.map((b) => b.category).filter(Boolean))];
  const authors = [
    ...new Set(blogs.map((b) => b.author?.name || b.author).filter(Boolean)),
  ];

  return (
    <div className="container my-4">
      <h2 className="mb-4">Blog Posts</h2>

      {/* Filter and Sort Form */}
      <form className="row g-3 mb-4 p-3 bg-light rounded border">
        <div className="col-md-3">
          <label htmlFor="title" className="form-label fw-semibold">
            Search Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Enter title"
            value={blogQuery.title}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="category" className="form-label fw-semibold">
            Category:
          </label>
          <select
            name="category"
            id="category"
            className="form-select"
            value={blogQuery.category}
            onChange={(e) => handleChange(e)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="author" className="form-label fw-semibold">
            Author:
          </label>
          <select
            name="author"
            id="author"
            className="form-select"
            value={blogQuery.author}
            onChange={(e) => handleChange(e)}
          >
            <option value="all">All Authors</option>
            {authors.map((auth, idx) => (
              <option key={idx} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="sort" className="form-label fw-semibold">
            Sort By:
          </label>
          <select
            name="sort"
            id="sort"
            className="form-select"
            value={blogQuery.sort}
            onChange={(e) => handleChange(e)}
          >
            <option value="">Default</option>
            <option value="dateDesc">Date: Newest First</option>
            <option value="dateAsc">Date: Oldest First</option>
            <option value="popDesc">Popularity: High to Low</option>
            <option value="popAsc">Popularity: Low to High</option>
          </select>
        </div>
      </form>

      {/* Loading & Error */}
      {loading && <p>Loading blogs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Blogs Display */}
      <div className="row g-4">
        {sortedList.length > 0 ? (
          sortedList.map((blog) => {
            const id = blog._id || blog.id;
            const authorName = blog.author?.name || blog.author || "Unknown";
            const dateStr = blog.createdAt || blog.date;

            return (
              <div className="col-md-4" key={id}>
                <div className="card h-100 shadow-sm">
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      className="card-img-top"
                      alt={blog.title}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-secondary mb-2 align-self-start">
                      {blog.category || "General"}
                    </span>
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text text-muted text-truncate">
                      {blog.body}
                    </p>
                    <p className="card-text small text-muted mb-3">
                      By <strong>{authorName}</strong> |{" "}
                      {dateStr ? new Date(dateStr).toLocaleDateString() : ""}
                    </p>

                    <div className="mt-auto d-flex gap-2">
                      <Link
                        to={`/blogs/${id}`}
                        className="btn btn-primary btn-sm flex-grow-1"
                      >
                        Read More
                      </Link>
                      {token && isBlogOwner(blog) && (
                        <>
                          <Link
                            to={`/edit-blog/${id}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h3>No blogs found</h3>
        )}
      </div>
    </div>
  );
};

export default BlogList;
