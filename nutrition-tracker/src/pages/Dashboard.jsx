import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Calendar from "react-calendar";
import { fetchNutritionData } from "../services/nutritionService";
import { saveFoodItems, loadFoodItems } from "../utils/foodLogStorage";
import { logoutUser } from "../services/authService";
import { getSessionUser, getUserGoals } from "../services/userService";
import { CATEGORIES, CATEGORY_LIST } from "../constants/appConstants";
import { defaultGoals } from "../pages/Goals";

import "../styles/Dashboard.css";

const formatDateKey = (date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).toLocaleDateString("en-CA");

const getStorageKey = (username, date) => `${username}_${formatDateKey(date)}`;

const Dashboard = ({ setUser }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [foodLog, setFoodLog] = useState({});
  const [foodEntry, setFoodEntry] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [goals, setGoals] = useState(defaultGoals);
  const [overLimit, setOverLimit] = useState(false);
  const [goalType, setGoalType] = useState("daily");

  const navigate = useNavigate();
  const username = getSessionUser();

  const loadFoodDataForDate = useCallback(
    (date) => {
      const key = getStorageKey(username, date);
      const items = loadFoodItems(key);
      setFoodItems(items);
      setFoodLog(calculateCategoryTotals(items));
    },
    [username]
  );

  const calculateCategoryTotals = (items) =>
    items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.calories;
      return acc;
    }, {});

  const calculateTotalMacros = (items) =>
    items.reduce(
      (totals, item) => {
        totals.calories += item.calories || 0;
        totals.protein += item.protein || 0;
        totals.carbs += item.carbs || 0;
        totals.fat += item.fat || 0;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  useEffect(() => {
    loadFoodDataForDate(selectedDate);
  }, [selectedDate, loadFoodDataForDate]);

  useEffect(() => {
    const userGoals = getUserGoals(username);
    setGoals(userGoals);
  }, [username]);

  useEffect(() => {
    if (!goals || !goals[goalType]) return;

    const { calories, protein, carbs, fat } = calculateTotalMacros(foodItems);
    const currentGoal = goals[goalType];

    const limitExceeded =
      calories > (currentGoal.calories || 0) ||
      protein > (currentGoal.protein || 0) ||
      carbs > (currentGoal.carbs || 0) ||
      fat > (currentGoal.fat || 0);

    setOverLimit(limitExceeded);
  }, [foodItems, goals, goalType]);

  const handleSearchFood = async () => {
    if (!foodEntry.trim()) return;
    try {
      const food = await fetchNutritionData(foodEntry);
      setSearchResult({
        name: food.food_name,
        calories: Math.round(food.nf_calories) || 0,
        protein: Math.round(food.nf_protein) || 0,
        carbs: Math.round(food.nf_total_carbohydrate) || 0,
        fat: Math.round(food.nf_total_fat) || 0,
      });
      setShowCategoryPicker(true);
    } catch (error) {
      console.error(error);
      alert("Error fetching food data.");
    }
  };

  const handleAddToCategory = (category) => {
    const newItem = {
      id: Date.now(),
      ...searchResult,
      category,
      date: formatDateKey(selectedDate),
    };
    const updatedItems = [...foodItems, newItem];
    setFoodItems(updatedItems);
    setFoodLog(calculateCategoryTotals(updatedItems));
    saveFoodItems(getStorageKey(username, selectedDate), updatedItems);
    clearSearchInput();
  };

  const handleDeleteItem = (id) => {
    const updatedItems = foodItems.filter((item) => item.id !== id);
    setFoodItems(updatedItems);
    setFoodLog(calculateCategoryTotals(updatedItems));
    saveFoodItems(getStorageKey(username, selectedDate), updatedItems);
  };

  const clearSearchInput = () => {
    setFoodEntry("");
    setSearchResult(null);
    setShowCategoryPicker(false);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/");
  };

  const totals = calculateTotalMacros(foodItems);

  const currentGoal = goals?.[goalType] || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="dashboard-main">
        <Topbar onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
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

          <div className="dashboard-container">
            <div className="food-log">
              <h2>Food Log</h2>

              <div className="food-log-search">
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={foodEntry}
                  onChange={(e) => setFoodEntry(e.target.value)}
                />
                <button onClick={handleSearchFood}>Search</button>
              </div>

              {showCategoryPicker && searchResult && (
                <div className="category-picker">
                  <p>
                    Found: <strong>{searchResult.name}</strong> —{" "}
                    <strong>{searchResult.calories} Cal</strong>
                  </p>
                  <p>Select category:</p>
                  <div className="category-buttons">
                    {Object.values(CATEGORIES).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleAddToCategory(cat)}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="calorie-summary">
                <p>{selectedDate.toLocaleDateString("en-US")}</p>
                <p>
                  <strong>{totals.calories} Cal Intake</strong> vs Goal:{" "}
                  <strong>{currentGoal.calories} Cal</strong>
                </p>
                <p>
                  {totals.protein}g Protein / {currentGoal.protein}g |{" "}
                  {totals.carbs}g Carbs / {currentGoal.carbs}g | {totals.fat}g
                  Fat / {currentGoal.fat}g
                </p>
                {overLimit && (
                  <div className="goal-warning">
                    ⚠️ You've achieved one or more of your {goalType} goals!
                  </div>
                )}
              </div>

              <div className="food-log-section">
                {CATEGORY_LIST.map((category) => (
                  <div key={category} className="food-log-row">
                    <span className="category-name">
                      {category.toUpperCase()}
                    </span>
                    <span className="category-value">
                      {foodLog[category] || 0}
                    </span>
                    {foodItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="food-log-entry-item">
                          <span>{item.name}</span>
                          <span>{item.calories} Cal</span>
                          <button onClick={() => handleDeleteItem(item.id)}>
                            🗑️
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="track-calendar">
              <h2>Track Calendar</h2>
              <Calendar onChange={setSelectedDate} value={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
