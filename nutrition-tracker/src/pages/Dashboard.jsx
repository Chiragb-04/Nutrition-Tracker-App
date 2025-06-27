import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { getSessionUser, getUserGoals } from "../services/userService";
import { loadFoodItems } from "../utils/foodLogStorage";
import { defaultGoals } from "../pages/Goals";
import "../styles/Dashboard.css";
import "react-calendar/dist/Calendar.css";

const formatDateKey = (date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).toLocaleDateString("en-CA");

const getStorageKey = (username, date) => `${username}_${formatDateKey(date)}`;

const Dashboard = ({ setUser }) => {
  const [goalType, setGoalType] = useState("daily");
  const [goals, setGoals] = useState(defaultGoals);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [isSidebarOpen] = useState(false);
  const username = getSessionUser();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const userGoals = getUserGoals(username);
    setGoals(userGoals);

    const todayKey = getStorageKey(username, selectedDate);
    const todayItems = loadFoodItems(todayKey) || [];

    const total = todayItems.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setTotals(total);
  }, [username, selectedDate]);

  const currentGoal = goals?.[goalType] || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  const ProgressBar = ({ label, value, max }) => {
    const percentage = Math.min((value / max) * 100, 100);

    let colorClass = "progress-gray";
    if (value === 0) colorClass = "progress-gray";
    else if (percentage < 25) colorClass = "progress-red";
    else if (percentage < 50) colorClass = "progress-yellow";
    else if (percentage < 75) colorClass = "progress-light-green";
    else if (percentage < 100) colorClass = "progress-green";
    else colorClass = "progress-orange"; // goal exceeded

    return (
      <div className="progress-bar-wrapper">
        <div className="progress-label">
          {label}: {value} / {max}
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${colorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`dashboard-main ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="goal-type-selector">
          <label>
            Goal Type:&nbsp;
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>

        <div className="goal-summary">
          <h2>Goal Progress</h2>
          <ProgressBar
            label="Calories"
            value={totals.calories}
            max={currentGoal.calories}
          />
          <ProgressBar
            label="Protein (g)"
            value={totals.protein}
            max={currentGoal.protein}
          />
          <ProgressBar
            label="Carbs (g)"
            value={totals.carbs}
            max={currentGoal.carbs}
          />
          <ProgressBar
            label="Fat (g)"
            value={totals.fat}
            max={currentGoal.fat}
          />
        </div>
        <div className="calendar-section">
          <h3>Select Date</h3>
          <Calendar
            onChange={(date) => setSelectedDate(date)}
            value={selectedDate}
            maxDate={new Date()}
            tileContent={({ date }) => {
              const key = getStorageKey(username, date);
              const logs = loadFoodItems(key);
              if (logs && logs.length > 0) {
                return <div className="dot-indicator" />;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
