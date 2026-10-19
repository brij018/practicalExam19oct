import React from "react";
import { Link } from "react-router-dom";
import BlogList from "./BlogList";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <div>
      {/* Hero Header */}
      <div className="bg-light py-5 border-bottom mb-4 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to BlogHub</h1>
          <p className="lead text-muted col-md-8 mx-auto">
            Discover engaging posts, share your thoughts, and connect with a
            vibrant community of writers.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            {token ? (
              <Link to="/create" className="btn btn-primary btn-lg">
                <i className="bi bi-pencil-square me-2"></i>Create a Post
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Sign In to Write
                </Link>
                <Link to="/register" className="btn btn-outline-secondary btn-lg">
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Blog List with Search, Filter & Sort */}
      <div className="container">
        <BlogList />
      </div>
    </div>
  );
};

export default Home;
