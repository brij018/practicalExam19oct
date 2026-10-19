import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../api/authApi";
import { logoutUser } from "../context/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token || localStorage.getItem("token"));

  const handleSignOut = () => {
    logout();
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2 fs-4" to="/">
          <i className="bi bi-journal-richtext text-primary"></i>
          <span>BlogHub</span>
        </Link>

        {/* Mobile Hamburger Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links & Actions */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active fw-semibold text-white" : ""}`
                }
              >
                <i className="bi bi-house me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active fw-semibold text-white" : ""}`
                }
              >
                <i className="bi bi-collection me-1"></i>Blog List
              </NavLink>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "active fw-semibold text-white" : ""}`
                  }
                >
                  <i className="bi bi-plus-circle me-1"></i>Add Blog
                </NavLink>
              </li>
            )}
          </ul>

          {/* User Authentication & Profile Actions */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `btn btn-sm ${
                      isActive ? "btn-light" : "btn-outline-light"
                    } d-flex align-items-center gap-1`
                  }
                >
                  <i className="bi bi-person-circle"></i>
                  <span>Profile</span>
                </NavLink>

                <button
                  type="button"
                  className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                  onClick={handleSignOut}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-light">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
