import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protected Route Component
 * - Agar user logged in nahi hai, to login page par redirect kar do
 * - Agar user logged in hai, to children component show karo
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show the protected content
  return children;
};

export default ProtectedRoute;
