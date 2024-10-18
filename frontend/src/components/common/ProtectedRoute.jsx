import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
