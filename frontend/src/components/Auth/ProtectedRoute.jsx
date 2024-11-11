import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  const role = localStorage.getItem("role");

  // If there's no role in localStorage or the role doesn't match the required role
  if (!role || role !== requiredRole) {
    return <Navigate to="/logout" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
