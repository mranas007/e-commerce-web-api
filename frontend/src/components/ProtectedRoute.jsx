import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token } = useAuth();

  // Check if user is authenticated
  if (token) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && user.role !== "Admin") {
    return <Navigate to="/home" replace />;
  }

    return children;
};

export default ProtectedRoute; 