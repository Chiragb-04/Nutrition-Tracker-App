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
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    if (!emailRegex.test(userData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(userData.phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!passwordRegex.test(userData.password)) {
      alert(
        "Password must be at least 6 characters and include at least one number and one letter."
      );
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
            pattern="[6-9]{1}[0-9]{9}"
            title="Enter a valid 10-digit mobile number starting with 6–9"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
            required
            pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}"
            title="At least 6 characters, one number, and one letter"
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
