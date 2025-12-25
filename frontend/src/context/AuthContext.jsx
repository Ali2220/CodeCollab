// User logged-in hai ya nahi, kaun hai, login/logout ka kaam — sab yahin handle hota hai

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, removeToken, removeUser } from '../utils/storage';
import * as authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// AuthProvider — boss component 👑 (Matlab: Jo bhi iske andar hoga, wo auth data use kar sakta hai.)
export const AuthProvider = ({ children }) => {
  // State for user and loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const initAuth = () => {
      // Get token and user from localStorage
      const token = getToken();
      const savedUser = getUser();

      // If both exist, user is logged in
      if (token && savedUser) {
        setUser(savedUser);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Context value 
  // Ye sab global ho gaya 🌍 Koi bhi component use kar sakta hai
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user, // true if user exists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};