/*
 * ============================================
 * API SERVICE - All Backend Communication
 * ============================================
 * 
 * This file handles ALL communication with the backend server.
 * It uses axios (a library for making HTTP requests).
 * 
 * What this file does:
 * 1. Creates an axios instance with base configuration
 * 2. Automatically adds authentication token to every request
 * 3. Handles errors globally (like unauthorized access)
 * 4. Provides simple functions to call backend APIs
 */

import axios from "axios";
import { getToken, saveToken, saveUser } from "./storage";

// ============================================
// CONFIGURATION
// ============================================

// Base URL for all API calls (backend server address)
const API_BASE_URL = import.meta.env.VITE_SERVER_URL 
  ? `${import.meta.env.VITE_SERVER_URL}/api` 
  : "http://localhost:3000/api";

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // We're sending JSON data
  },
  withCredentials: true, // IMPORTANT: This allows cookies to be sent/received
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// This runs BEFORE every API request
// It adds the authentication token to the request headers

api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = getToken();

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // If there's an error setting up the request, reject it
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// This runs AFTER every API response
// It handles common errors like unauthorized access

api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // If we get a 401 (Unauthorized) error
    if (error.response?.status === 401) {
      // Clear all stored data
      localStorage.clear();
      // Redirect to login page
      window.location.href = "/login";
    }

    // Reject the promise so the calling code can handle the error
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION APIs
// ============================================

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise} User data with token
 */
export const register = async (userData) => {
  try {
    // Make POST request to register endpoint
    const response = await api.post("/auth/register", userData);

    // Save token and user data to localStorage
    if (response.data.token) {
      saveToken(response.data.token);
      saveUser(response.data);
    }

    return response.data;
  } catch (error) {
    // Throw error with message from backend or default message
    throw error.response?.data || { message: "Registration failed" };
  }
};

/**
 * Login existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} User data with token
 */
export const login = async (credentials) => {
  try {
    // Make POST request to login endpoint
    const response = await api.post("/auth/login", credentials);

    // Save token and user data to localStorage
    if (response.data.token) {
      saveToken(response.data.token);
      saveUser(response.data);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

/**
 * Logout user (just clear local storage)
 */
export const logout = () => {
  localStorage.clear();
};

// ============================================
// ROOM APIs
// ============================================

/**
 * Get all rooms for current user
 * @returns {Promise} Array of rooms
 */
export const getRooms = async () => {
  try {
    const response = await api.get("/rooms");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch rooms" };
  }
};

/**
 * Create a new room
 * @param {Object} roomData - { name, description, language }
 * @returns {Promise} Created room data
 */
export const createRoom = async (roomData) => {
  try {
    const response = await api.post("/rooms", roomData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create room" };
  }
};

/**
 * Get room by ID
 * @param {string} roomId - Room ID
 * @returns {Promise} Room data
 */
export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch room" };
  }
};

/**
 * Join a room
 * @param {string} roomId - Room ID to join
 * @returns {Promise} Updated room data
 */
export const joinRoom = async (roomId) => {
  try {
    const response = await api.post(`/rooms/${roomId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to join room" };
  }
};

/**
 * Leave a room
 * @param {string} roomId - Room ID to leave
 * @returns {Promise} Success message
 */
export const leaveRoom = async (roomId) => {
  try {
    const response = await api.post(`/rooms/${roomId}/leave`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to leave room" };
  }
};

/**
 * Delete a room (creator only)
 * @param {string} roomId - Room ID to delete
 * @returns {Promise} Success message
 */
export const deleteRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete room" };
  }
};

// ============================================
// CODE APIs
// ============================================

/**
 * Save code to room
 * @param {string} roomId - Room ID
 * @param {Object} codeData - { content, language, changeDescription }
 * @returns {Promise} Saved code data
 */
export const saveCode = async (roomId, codeData) => {
  try {
    const response = await api.post(`/code/${roomId}`, codeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to save code" };
  }
};

/**
 * Get code history for a room
 * @param {string} roomId - Room ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise} Code history with pagination
 */
export const getCodeHistory = async (roomId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/code/${roomId}/history`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch code history" };
  }
};

/**
 * Get current code in room
 * @param {string} roomId - Room ID
 * @returns {Promise} Current code data
 */
export const getCurrentCode = async (roomId) => {
  try {
    const response = await api.get(`/code/${roomId}/current`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch current code" };
  }
};

/**
 * Get specific code version
 * @param {string} roomId - Room ID
 * @param {number} version - Version number
 * @returns {Promise} Code version data
 */
export const getCodeVersion = async (roomId, version) => {
  try {
    const response = await api.get(`/code/${roomId}/version/${version}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch code version" };
  }
};

// ============================================
// AI APIs
// ============================================

/**
 * Get AI code suggestions
 * @param {Object} data - { code, language, context }
 * @returns {Promise} AI suggestion
 */
export const getCodeSuggestions = async (data) => {
  try {
    const response = await api.post("/ai/suggest", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get suggestions" };
  }
};

/**
 * Get AI code review
 * @param {Object} data - { code, language }
 * @returns {Promise} AI review
 */
export const reviewCode = async (data) => {
  try {
    const response = await api.post("/ai/review", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to review code" };
  }
};

/**
 * Get AI code explanation
 * @param {Object} data - { code, language }
 * @returns {Promise} AI explanation
 */
export const explainCode = async (data) => {
  try {
    const response = await api.post("/ai/explain", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to explain code" };
  }
};

/**
 * Get AI code fix
 * @param {Object} data - { code, language, issue }
 * @returns {Promise} Fixed code
 */
export const fixCode = async (data) => {
  try {
    const response = await api.post("/ai/fix", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fix code" };
  }
};

// Export the axios instance for custom requests if needed
export default api;
