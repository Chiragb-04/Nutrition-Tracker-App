import { USERS_KEY, SESSION_USER_KEY } from "../constants/storageKeys";

export function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

export function getUser(username) {
  const users = getAllUsers();
  return users[username] || null;
}

export function saveUser(username, userData) {
  const users = getAllUsers();
  users[username] = userData;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setSessionUser(username, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(SESSION_USER_KEY, username);
}

export function getSessionUser() {
  return (
    localStorage.getItem(SESSION_USER_KEY) ||
    sessionStorage.getItem(SESSION_USER_KEY)
  );
}

export function clearSessionUser() {
  localStorage.removeItem(SESSION_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}

export function saveUserGoals(username, goals) {
  const user = getUser(username);
  if (!user) return;
  user.goals = goals;
  saveUser(username, user);
}

export function getUserGoals(username) {
  const user = getUser(username);
  return user?.goals || null;
}

export function addFoodLog(username, foodEntry) {
  const user = getUser(username);
  if (!user) return;
  if (!user.foodLogs) user.foodLogs = [];
  user.foodLogs.push({
    ...foodEntry,
    date: new Date().toISOString(),
  });
  saveUser(username, user);
}

export function getTodaysFoodLogs(username) {
  const user = getUser(username);
  const today = new Date().toISOString().split("T")[0];
  return user?.foodLogs?.filter((log) => log.date.startsWith(today)) || [];
}
