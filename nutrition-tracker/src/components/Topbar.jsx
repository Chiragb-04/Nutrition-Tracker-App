import React from "react";
import logo from "../assets/appLogo.png";
import "../styles/Dashboard.css";

const Topbar = ({ onToggleSidebar, onLogout }) => (
  <header className="topbar">
    <button
      className="hamburger"
      onClick={onToggleSidebar}
      aria-label="Toggle Sidebar"
    >
      ≡
    </button>

    <div className="logo-container">
      <img src={logo} alt="App Logo" className="logo-img" />
    </div>

    <nav className="topbar-nav">
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </nav>
  </header>
);

export default Topbar;
