/*
 * ============================================
 * MAIN APP COMPONENT
 * ============================================
 * 
 * This is the root component of our application.
 * It sets up:
 * 1. React Router (for navigation between pages)
 * 2. AuthProvider (for user authentication state)
 * 3. SocketProvider (for real-time Socket.io connection)
 * 4. Toast notifications (for success/error messages)
 * 
 * Component hierarchy:
 * App
 *  └─ BrowserRouter
 *      └─ AuthProvider
 *          └─ SocketProvider
 *              └─ AppRoutes (all pages)
 *              └─ Toaster (notifications)
 */

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          {/* All Routes (pages) */}
          <AppRoutes />

          {/* Toast Notifications (success/error messages) */}
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
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
