/*
 * ============================================
 * STORAGE UTILITY - localStorage Management
 * ============================================
 * 
 * This file provides simple functions to save and retrieve data
 * from the browser's localStorage.
 * 
 * What is localStorage?
 * It's like a small database in your browser that stores data
 * even after you close the browser. Perfect for saving user info!
 * 
 * Note: localStorage can only store strings, so we use JSON.stringify
 * to convert objects to strings, and JSON.parse to convert back.
 */

import { STORAGE_KEYS } from "./constants";

// ============================================
// GENERIC STORAGE FUNCTIONS
// ============================================

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {any} value - The value to store (will be converted to JSON)
 */
export const setItem = (key, value) => {
  try {
    // Convert value to JSON string and save
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve data from
 * @returns {any} The stored value (converted from JSON) or null
 */
export const getItem = (key) => {
  try {
    // Get the item from localStorage
    const item = localStorage.getItem(key);
    
    // If item exists, parse it from JSON string to object
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

/**
 * Remove a specific item from localStorage
 * @param {string} key - The key to remove
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

/**
 * Clear all data from localStorage
 * Use this when user logs out
 */
export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// ============================================
// SPECIFIC HELPERS FOR TOKEN & USER
// ============================================
// These are shortcuts for commonly used storage operations

/**
 * Save authentication token
 * @param {string} token - JWT token from backend
 */
export const saveToken = (token) => setItem(STORAGE_KEYS.TOKEN, token);

/**
 * Get authentication token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => getItem(STORAGE_KEYS.TOKEN);

/**
 * Remove authentication token
 */
export const removeToken = () => removeItem(STORAGE_KEYS.TOKEN);

/**
 * Save user data
 * @param {Object} user - User object from backend
 */
export const saveUser = (user) => setItem(STORAGE_KEYS.USER, user);

/**
 * Get user data
 * @returns {Object|null} User object or null
 */
export const getUser = () => getItem(STORAGE_KEYS.USER);

/**
 * Remove user data
 */
export const removeUser = () => removeItem(STORAGE_KEYS.USER);
