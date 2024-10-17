import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [Email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: Email, // Use state variable for email
          password: password, // Use state variable for password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.token); //MAKE SURE TO COMMENT THIS OUT AT THE END

      // Store JWT in a cookie
      document.cookie = `token=${response.data.token}; path=/;`;

      alert("Login successful");
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Login failed: " + (error.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Email"
        value={Email}
        onChange={(e) => setEmail(e.target.value)} // Update state on change
        required // Optional: Add required attribute for validation
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Update state on change
        required // Optional: Add required attribute for validation
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
