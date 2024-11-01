import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import site from "../common/API";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await site.post("/api/auth/login", { email, password });
      const now = new Date();
      now.setTime(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds
      const expires = `expires=${now.toUTCString()}`;
      // Store JWT in cookies with 2-day expiry
      document.cookie = `token=${data.token}; path=/; ${expires};`;
      alert("Login successful");
      // navigate("/driver-dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default LoginForm;
