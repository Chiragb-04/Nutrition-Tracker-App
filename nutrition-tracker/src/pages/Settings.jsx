import React from "react";
import ProfileSection from "./ProfileSection";
import ResetPasswordSection from "./ResetPasswordSection";
import "../styles/Settings.css";

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        <ProfileSection />
        <ResetPasswordSection />
      </div>
    </div>
  );
};

export default Settings;
