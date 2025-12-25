
/*
 * ============================================
 * APP ROUTES - Routing Configuration
 * ============================================
 * 
 * This file defines all the routes (pages) in our app.
 * 
 * Public routes: Anyone can access
 * - / (Home)
 * - /login
 * - / /register
 * 
 * Protected routes: Only logged-in users can access
 * - /dashboard
 * - /room/:roomId
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Room from "../pages/Room";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  // Get authentication status
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES
          ============================================ */}
      {/* Home - Always accessible */}
      <Route path="/" element={<Home />} />

      {/* Auth Routes - If already logged in, redirect to dashboard */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* ============================================
          PROTECTED ROUTES
          ============================================ */}
      {/* Dashboard - Only logged-in users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Room - Only logged-in users */}
      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          404 - Redirect any other route to home
          ============================================ */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;


