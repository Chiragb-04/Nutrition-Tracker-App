import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
import hero from "../assets/hero-register.png";
import { getAllUsers, saveUser } from "../services/userService";

export default function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const existingUsers = getAllUsers();
    if (existingUsers[userData.username]) {
      alert("Username already exists");
      return;
    }

    saveUser(userData.username, {
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
    });

    alert("Registration successful!");
    navigate("/");
  };

  return (
    <div className="register-page">
      <div className="register-top">
        <img src={hero} alt="FitFuel Nutrition" className="register-hero-img" />
      </div>

      <div className="register-form-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Register</h2>
          <p>Please register to login.</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={userData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
            required
          />

          <button type="submit">Sign Up</button>
          <p className="login-link">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
