import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogFood from "./pages/LogFood";
import Goals from "./pages/Goals";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function AppRoutes({ user, setUser }) {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            !user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/log" element={user ? <LogFood /> : <Navigate to="/" />} />
        <Route path="/goals" element={user ? <Goals /> : <Navigate to="/" />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}
