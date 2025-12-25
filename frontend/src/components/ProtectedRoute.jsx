/*
 * ============================================
 * PROTECTED ROUTE - Route Protection
 * ============================================
 * 
 * This component protects routes that require authentication.
 * 
 * How it works:
 * 1. Check if user is logged in
 * 2. If yes, show the protected content (children)
 * 3. If no, redirect to login page
 * 
 * Example usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth();

  // ============================================
  // LOADING STATE
  // ============================================
  // While checking if user is logged in, show loading spinner
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Spinning circle loader */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // ============================================
  // NOT AUTHENTICATED
  // ============================================
  // If user is not logged in, redirect to login page
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ============================================
  // AUTHENTICATED
  // ============================================
  // If user is logged in, show the protected content
  
  return children;
};

export default ProtectedRoute;
