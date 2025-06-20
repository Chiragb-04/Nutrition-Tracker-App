import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home">
      <h1>Nutrition Tracker</h1>
      <p>Track your food, set goals, and stay healthy.</p>
      <div className="nav-buttons">
        <Link to="/log">
          <button>Log Food</button>
        </Link>
        <Link to="/goals">
          <button>Set Goals</button>
        </Link>
        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
