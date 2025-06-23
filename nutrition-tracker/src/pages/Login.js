import React, { useState } from "react";
import "../styles/Auth.css";
import hero from "../assets/hero-login.png";
import { getUser, setSessionUser } from "../services/userService";

export default function Login({ setUser }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = getUser(credentials.username);
    if (storedUser && storedUser.password === credentials.password) {
      setSessionUser(credentials.username, rememberMe);
      setUser(credentials.username);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="register-page">
      <div className="register-top">
        <img src={hero} alt="Login Hero" className="register-hero-img" />
      </div>

      <div className="register-form-container">
        <form className="register-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <p className="sub-text">Welcome back! Please log in.</p>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />

          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{" "}
              Remember me
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Log In
          </button>

          <p className="login-link">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
