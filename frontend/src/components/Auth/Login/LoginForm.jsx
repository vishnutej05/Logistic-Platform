import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import site from "../../common/API";
import "./LoginForm.css"; // Import your CSS file for styling

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await site.post("/api/auth/login", { email, password });
      const now = new Date();
      now.setTime(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds
      const expires = `expires=${now.toUTCString()}`;
      // Store JWT in cookies with 2-day expiry
      document.cookie = `token=${data.token}; path=/; ${expires};`;

      // Store role in localStorage
      localStorage.setItem("role", data.role);

      alert("Login successful");
      // Redirect based on user role
      if (data.role === "user") {
        navigate("/user-dashboard");
      } else if (data.role === "driver") {
        navigate("/driver-create");
      } else if (data.role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
