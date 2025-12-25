/*
 * ============================================
 * AUTH CONTEXT - User Authentication State
 * ============================================
 * 
 * This file manages the user's login state across the entire app.
 * 
 * What is Context in React?
 * Context is like a "global storage" that any component can access.
 * Instead of passing user data through every component (called "prop drilling"),
 * we store it here and any component can grab it when needed.
 * 
 * This context provides:
 * - user: The logged-in user's data (or null if not logged in)
 * - loading: Whether we're checking if user is logged in
 * - login(): Function to log in
 * - register(): Function to create account
 * - logout(): Function to log out
 * - isAuthenticated: Boolean - is user logged in?
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser } from '../utils/storage';
import * as api from '../utils/api';

// ============================================
// CREATE CONTEXT
// ============================================

// Create the context (like creating a box to store data)
const AuthContext = createContext();

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================
// This component wraps our app and provides auth data to all children

export const AuthProvider = ({ children }) => {
  // ============================================
  // STATE
  // ============================================
  
  // Store the current user (null if not logged in)
  const [user, setUser] = useState(null);
  
  // Track if we're still checking if user is logged in
  const [loading, setLoading] = useState(true);

  // ============================================
  // CHECK IF USER IS ALREADY LOGGED IN
  // ============================================
  // This runs once when the app first loads
  
  useEffect(() => {
    const initAuth = () => {
      // Get token and user from localStorage
      const token = getToken();
      const savedUser = getUser();

      // If both exist, user is logged in
      if (token && savedUser) {
        setUser(savedUser);
      }

      // Done checking
      setLoading(false);
    };

    initAuth();
  }, []); // Empty array means this runs only once

  // ============================================
  // REGISTER FUNCTION
  // ============================================
  // Create a new user account
  
  const register = async (userData) => {
    try {
      // Call the register API
      const response = await api.register(userData);
      
      // Save user to state
      setUser(response);
      
      return response;
    } catch (error) {
      // If error, throw it so the component can show error message
      throw error;
    }
  };

  // ============================================
  // LOGIN FUNCTION
  // ============================================
  // Log in an existing user
  
  const login = async (credentials) => {
    try {
      // Call the login API
      const response = await api.login(credentials);
      
      // Save user to state
      setUser(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================
  // Log out the current user
  
  const logout = () => {
    // Clear localStorage
    api.logout();
    
    // Clear user from state
    setUser(null);
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  // This is what components can access
  
  const value = {
    user,                          // Current user data
    loading,                       // Is still checking login status?
    register,                      // Function to register
    login,                         // Function to login
    logout,                        // Function to logout
    isAuthenticated: !!user,       // Boolean: is user logged in? (!! converts to boolean)
  };

  // ============================================
  // PROVIDE CONTEXT TO CHILDREN
  // ============================================
  // Wrap children with the context provider
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK TO USE AUTH CONTEXT
// ============================================
// This makes it easy to use auth in any component

export const useAuth = () => {
  // Get the context
  const context = useContext(AuthContext);
  
  // If context is undefined, we're using it outside of AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};