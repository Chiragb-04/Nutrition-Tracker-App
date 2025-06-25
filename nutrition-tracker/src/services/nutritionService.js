import axios from "axios";

const NUTRITIONIX_APP_ID = process.env.REACT_APP_NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.REACT_APP_NUTRITIONIX_APP_KEY;

const BASE_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients";

export const fetchNutritionData = async (query) => {
  const response = await axios.post(
    BASE_URL,
    { query },
    {
      headers: {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_APP_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.foods[0];
};
