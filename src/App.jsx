import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./routes/MainLayout";
import Home from "./components/Home";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />

          {/* Protected Routes: Must be logged in */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-blog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-blog/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id/edit"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
