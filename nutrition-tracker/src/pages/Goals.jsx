import React, { useState, useEffect } from "react";
import "../styles/SetGoals.css";
import {
  getSessionUser,
  saveUserGoals,
  getUserGoals,
} from "../services/userService";

export const defaultGoals = {
  daily: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  weekly: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  monthly: { calories: 0, protein: 0, carbs: 0, fat: 0 },
};

const goalTypes = ["daily", "weekly", "monthly"];

const SetGoals = () => {
  const username = getSessionUser();
  const [goalType, setGoalType] = useState("daily");
  const [goals, setGoals] = useState(defaultGoals);

  useEffect(() => {
    if (username) {
      const existingGoals = getUserGoals(username);
      if (existingGoals) {
        setGoals((prev) => ({
          ...prev,
          ...existingGoals,
        }));
      }
    }
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({
      ...prev,
      [goalType]: {
        ...prev[goalType],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      saveUserGoals(username, goals);
      alert(
        `${goalType.charAt(0).toUpperCase() + goalType.slice(1)} goals saved!`
      );
    }
  };

  return (
    <div className="goals-page">
      <h2>Set Your Nutrition Goals</h2>

      <form className="goals-form" onSubmit={handleSubmit}>
        <label>
          Goal Type:
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            {goalTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Calories:
          <input
            type="number"
            name="calories"
            value={goals[goalType].calories}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Protein (g):
          <input
            type="number"
            name="protein"
            value={goals[goalType].protein}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Carbs (g):
          <input
            type="number"
            name="carbs"
            value={goals[goalType].carbs}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Fat (g):
          <input
            type="number"
            name="fat"
            value={goals[goalType].fat}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Save Goals</button>
      </form>
    </div>
  );
};

export default SetGoals;
