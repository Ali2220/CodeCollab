import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

/**
 * Main App Component
 * Flow:
 * 1. BrowserRouter - React Router setup
 * 2. AuthProvider - Global auth state
 * 3. AppRoutes - All routes
 * 4. Toaster - Toast notifications
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* All Routes */}
        <AppRoutes />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#363636",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
