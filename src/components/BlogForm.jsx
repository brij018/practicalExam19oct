import React, { useState } from "react";

const BlogForm = ({ initialValues, loading, submitLabel, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    category: initialValues?.category || "Technology",
    coverImage: initialValues?.coverImage || "",
    body: initialValues?.body || "",
    media: initialValues?.media || [],
  });

  const [mediaFiles, setMediaFiles] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setMediaFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, mediaFiles });
  };

  return (
    <form className="card p-4 shadow-sm border" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-semibold">Blog Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Category</label>
        <select
          name="category"
          className="form-select"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="Travel">Travel</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Cover Image URL (Optional)</label>
        <input
          type="url"
          name="coverImage"
          className="form-control"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Upload Media (Images/Videos)</label>
        <input
          type="file"
          className="form-control"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Content</label>
        <textarea
          name="body"
          className="form-control"
          value={formData.body}
          onChange={handleChange}
          placeholder="Write your blog content here..."
          rows="8"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default BlogForm;
