import React, { useState, useEffect } from "react";
import { getSessionUser, getUser, saveUser } from "../services/userService";
import "../styles/Settings.css";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const username = getSessionUser();
    if (username) {
      const userData = getUser(username);
      setUser(userData);
      setForm({
        username: username,
        email: userData?.email || "",
        phone: userData?.phone || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const updatedUser = {
      ...user,
      email: form.email,
      phone: form.phone,
    };
    saveUser(form.username, updatedUser);
    setUser(updatedUser);
    setEditing(false);
  };

  return (
    <div className="profile-section">
      <h2>Profile</h2>
      {user ? (
        <>
          <div className="profile-field">
            <label>Username:</label>
            <span>{form.username}</span>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            ) : (
              <span>{form.email}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Mobile:</label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            ) : (
              <span>{form.phone}</span>
            )}
          </div>

          {editing ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={() => setEditing(true)}>Edit</button>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfileSection;
