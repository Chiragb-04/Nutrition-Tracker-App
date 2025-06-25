const USER_KEY = "sessionUser";

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};
