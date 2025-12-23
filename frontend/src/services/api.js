// api.js ek centralized axios service hai jo har API request me automatically auth token add karti hai aur 401 error pe user ko logout karke login page par redirect kar deti hai.

import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { getToken } from "../utils/storage";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important for cookies
});

// Har API request jaane se pehle
// token localStorage se nikalo
// header me chipka do

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = getToken();

    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Agar API bole ❌ “Unauthorized”
// To:
// token clear
// user logout
// login page pe bhej do
// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // If response is successful, return data
    return response;
  },
  (error) => {
    // If unauthorized (401), redirect to login
    if (error.response?.status === 401) {
      // Clear storage
      localStorage.clear();
      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api