import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import LogFood from "./pages/LogFood";
import Goals from "./pages/Goals";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sessionUser");
    sessionStorage.removeItem("sessionUser");
    navigate("/");
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            !user ? <Login setUser={setUser} /> : <Navigate to="/home" />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/log" element={user ? <LogFood /> : <Navigate to="/" />} />
        <Route path="/goals" element={user ? <Goals /> : <Navigate to="/" />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>

      {user && (
        <div className="logout-container">
          <p>
            Logged in as <strong>{user}</strong>{" "}
            <button onClick={logout}>Logout</button>
          </p>
        </div>
      )}
    </>
  );
}
