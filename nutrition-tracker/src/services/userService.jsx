// userStorageService.js

const USERS_KEY = "users";
const SESSION_USER_KEY = "sessionUser";

/**
 * Fetch all users from localStorage.
 * @returns {Object} All registered users keyed by username.
 */
export function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

/**
 * Save or update a single user by username.
 * @param {string} username - The unique username.
 * @param {Object} userData - User data object (e.g., email, password).
 */
export function saveUser(username, userData) {
  const users = getAllUsers();
  users[username] = userData;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Get a specific user by username.
 * @param {string} username
 * @returns {Object|null} User data or null if not found.
 */
export function getUser(username) {
  const users = getAllUsers();
  return users[username] || null;
}

/**
 * Persist the session user.
 * @param {string} username
 * @param {boolean} remember - If true, use localStorage; else, sessionStorage.
 */
export function setSessionUser(username, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(SESSION_USER_KEY, username);
}

/**
 * Get the current logged-in session user.
 * @returns {string|null} Username if found, else null.
 */
export function getSessionUser() {
  return (
    localStorage.getItem(SESSION_USER_KEY) ||
    sessionStorage.getItem(SESSION_USER_KEY)
  );
}

/**
 * Clear the current session user from both storage types.
 */
export function clearSessionUser() {
  localStorage.removeItem(SESSION_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}
