import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../api/authApi";
import { loginUser } from "../context/authThunk";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      // Call authApi login and update Redux auth state
      await login(formData);
      dispatch(loginUser(formData));
      setMessage("Login successful!");
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm p-4 border">
            <h2 className="text-center mb-1 fw-bold">Welcome Back</h2>
            <p className="text-center text-muted mb-4">Login to your account</p>

            {message && (
              <div
                className={`alert ${
                  message.includes("successful") ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mt-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-3 text-muted">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
