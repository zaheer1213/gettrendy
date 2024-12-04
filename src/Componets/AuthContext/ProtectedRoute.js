import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
