import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import { fetchNutritionData } from "../services/nutritionService";
import { saveFoodItems, loadFoodItems } from "../utils/foodLogStorage";
import { getSessionUser } from "../services/userService";
import { CATEGORIES, CATEGORY_LIST } from "../constants/appConstants";
import "../styles/LogFood.css";

const formatDateKey = (date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).toLocaleDateString("en-CA");

const getStorageKey = (username, date) => `${username}_${formatDateKey(date)}`;

const LogFood = ({ setUser }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodItems, setFoodItems] = useState([]);
  const [foodEntry, setFoodEntry] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const username = getSessionUser();

  const loadFoodDataForDate = useCallback(
    (date) => {
      const key = getStorageKey(username, date);
      const items = loadFoodItems(key) || [];
      setFoodItems(items);
    },
    [username]
  );

  useEffect(() => {
    loadFoodDataForDate(selectedDate);
  }, [selectedDate, loadFoodDataForDate]);

  const handleSearchFood = async () => {
    if (!foodEntry.trim()) return;
    try {
      const food = await fetchNutritionData(foodEntry);
      const timestamp = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setSearchResult({
        id: Date.now(),
        name: food.food_name,
        calories: Math.round(food.nf_calories) || 0,
        protein: Math.round(food.nf_protein) || 0,
        carbs: Math.round(food.nf_total_carbohydrate) || 0,
        fat: Math.round(food.nf_total_fat) || 0,
        timestamp,
        date: formatDateKey(selectedDate),
      });
      setShowCategoryPicker(true);
    } catch (error) {
      console.error(error);
      alert("Error fetching food data.");
    }
  };

  const handleAddToCategory = (category) => {
    if (searchResult) {
      const newItem = { ...searchResult, category };
      const updatedItems = [...foodItems, newItem];
      setFoodItems(updatedItems);
      saveFoodItems(getStorageKey(username, selectedDate), updatedItems);
      setShowCategoryPicker(false);
      setSearchResult(null);
      setFoodEntry("");
    }
  };

  const handleDeleteItem = (id) => {
    const updatedItems = foodItems.filter((item) => item.id !== id);
    setFoodItems(updatedItems);
    saveFoodItems(getStorageKey(username, selectedDate), updatedItems);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const key = getStorageKey(username, date);
      const items = loadFoodItems(key) || [];
      return items.length > 0 ? (
        <div className="log-count">{items.length}</div>
      ) : null;
    }
    return null;
  };

  return (
    <div
      className={`main-content ${
        window.innerWidth > 768 ? "sidebar-pushed" : ""
      }`}
    >
      <div className="dashboard-contente">
        <h1>Log Food</h1>
        <div className="food-log-search">
          <input
            type="text"
            placeholder="Search food (e.g., Apple, Rice)..."
            value={foodEntry}
            onChange={(e) => setFoodEntry(e.target.value)}
            aria-label="Search food items"
          />
          <button onClick={handleSearchFood} aria-label="Search">
            Search
          </button>
        </div>

        {showCategoryPicker && searchResult && (
          <div className="category-picker">
            <p>
              Found: <strong>{searchResult.name}</strong> —{" "}
              <strong>{searchResult.calories} Cal</strong> (Logged at{" "}
              {searchResult.timestamp})
            </p>
            <p>Select category:</p>
            <div className="category-buttons">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleAddToCategory(cat)}
                  aria-label={`Add to ${cat}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="food-log-section">
          {CATEGORY_LIST.map((category) => {
            const categoryItems = foodItems.filter(
              (item) => item.category === category
            );
            return (
              categoryItems.length > 0 && (
                <div key={category} className="food-log-row">
                  <div
                    className="category-header"
                    onClick={() => toggleCategory(category)}
                    aria-expanded={expandedCategory === category}
                  >
                    <span className="category-name">
                      {category.toUpperCase()}
                    </span>
                    <span className="category-value">
                      {categoryItems.length}
                    </span>
                    <span className="toggle-icon">
                      {expandedCategory === category ? "▼" : "▶"}
                    </span>
                  </div>
                  {expandedCategory === category && (
                    <div className="food-log-items">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="food-log-entry-item">
                          <span>
                            {item.name} (Logged at {item.timestamp})
                          </span>
                          <span>{item.calories} Cal</span>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            aria-label="Delete item"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            );
          })}
        </div>

        <div className="track-calendar">
          <h2>Track Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="food-calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default LogFood;
