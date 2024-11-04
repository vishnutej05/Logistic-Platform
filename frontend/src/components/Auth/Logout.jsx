import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Remove role from local storage
    localStorage.removeItem("role");

    // Optionally, navigate to the login page after logout
    navigate("/login");
  };

  return (
    <div className="logout-container">
      <h2>Are you sure you want to log out?</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Logout;
