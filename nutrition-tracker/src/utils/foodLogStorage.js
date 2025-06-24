export const saveFoodItems = (dateKey, items) => {
  localStorage.setItem(`foodItems-${dateKey}`, JSON.stringify(items));
};

export const loadFoodItems = (dateKey) => {
  const data = localStorage.getItem(`foodItems-${dateKey}`);
  return data ? JSON.parse(data) : [];
};

export const saveCategoryTotals = (totals) => {
  localStorage.setItem("categoryTotals", JSON.stringify(totals));
};

export const loadCategoryTotals = () => {
  const data = localStorage.getItem("categoryTotals");
  return data ? JSON.parse(data) : {};
};
