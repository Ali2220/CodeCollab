// authService.js authentication ka service layer hai jo register, login, profile fetch aur logout ke API calls handle karta hai aur login/register pe token + user ko localStorage me save karta hai.

import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";
import { saveToken, saveUser } from "../utils/storage";

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);

    // Save token and user to localStorage
    if (response.data.token) {
      saveToken(response.data.token);
      saveUser(response.data);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Save token and user to localStorage
    if (response.data.token) {
      saveToken(response.data.token);
      saveUser(response.data);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Logout (clear local storage)
export const logout = () => {
  localStorage.clear();
};