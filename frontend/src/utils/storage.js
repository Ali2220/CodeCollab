// storage.js ek utility file hai jo localStorage ke common operations ko centralize karti hai aur token/user management ko simple aur safe banati hai.

import { STORAGE_KEYS } from "./constants";

// Save data to localStorage
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Get data from localStorage
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

// Remove item from localStorage
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

// Clear all localStorage
export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};


// Specific helpers for token & user
export const saveToken = (token) => setItem(STORAGE_KEYS.TOKEN, token) 
export const getToken = () => getItem(STORAGE_KEYS.TOKEN)
export const removeToken = () => removeItem(STORAGE_KEYS.TOKEN)


export const saveUser = (user) => setItem(STORAGE_KEYS.USER, user)
export const getUser = () => getItem(STORAGE_KEYS.USER)
export const removeUser = () => removeItem(STORAGE_KEYS.USER)
