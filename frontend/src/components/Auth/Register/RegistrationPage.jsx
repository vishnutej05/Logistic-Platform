import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import site from "../../common/API";
import "./RegistrationPage.css"; // Import CSS for styling

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  const [error, setError] = useState(""); // State for error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await site.post("/api/auth/register", formData);
      console.log("User Registered:", response.data); // For demonstration

      console.log(formData.role);
      // Navigate to login page after registration
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); // Display error message
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="registration-page">
      <h1>Welcome to My Site</h1>
      <h2>Please Make Your Identity</h2>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
