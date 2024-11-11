import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();

  const getToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
  };

  const role = localStorage.getItem("role");

  // console.log("User Role:", role);
  // console.log("Required Role:", requiredRole);
  // console.log("Token Present:", Boolean(getToken()));

  // Check if the user is authenticated
  if (!getToken()) {
    console.log("No token found, redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the role in localStorage matches the required role for this route
  if (role !== requiredRole) {
    console.log(
      `Role mismatch: User role is ${role} but needs ${requiredRole}. Redirecting to logout.`
    );
    return <Navigate to="/logout" replace />;
  }

  // Render the protected content for authorized users
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
