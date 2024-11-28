import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import site from "../../common/API";

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
        navigate("/submit-details");
      } else if (data.role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-indigo-900 animate-fade-in">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <FiMail className="absolute top-3.5 left-3 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 bg-gray-50"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <FiLock className="absolute top-3.5 left-3 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300 bg-gray-50"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-[1.02]"
              aria-label="Sign in button"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
