/*
 * ============================================
 * SOCKET CONTEXT - Real-time Connection State
 * ============================================
 * 
 * This file manages the Socket.io connection across the entire app.
 * 
 * Why do we need this?
 * Socket.io needs to be initialized once and shared across all components.
 * This context creates the socket connection and makes it available
 * to any component that needs it.
 * 
 * This context provides:
 * - socket: The Socket.io instance
 * - connected: Boolean - is socket connected?
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

// ============================================
// CREATE CONTEXT
// ============================================

const SocketContext = createContext();

// ============================================
// SOCKET PROVIDER COMPONENT
// ============================================

export const SocketProvider = ({ children }) => {
  // ============================================
  // STATE
  // ============================================
  
  // Store the socket instance
  const [socket, setSocket] = useState(null);
  
  // Track connection status
  const [connected, setConnected] = useState(false);
  
  // Get auth state to check if user is logged in
  const { isAuthenticated } = useAuth();

  // ============================================
  // INITIALIZE SOCKET WHEN USER LOGS IN
  // ============================================
  
  useEffect(() => {
    // Only create socket if user is logged in
    if (isAuthenticated) {
      console.log('🔌 Initializing Socket.io connection...');
      
      // Create socket connection
      const newSocket = initializeSocket();
      
      // Save socket to state
      setSocket(newSocket);
      
      // Listen for connection status changes
      newSocket.on('connect', () => {
        console.log('✅ Socket connected');
        setConnected(true);
      });
      
      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setConnected(false);
      });
      
      // Cleanup function: disconnect socket when component unmounts
      // or when user logs out
      return () => {
        console.log('🔌 Disconnecting socket...');
        newSocket.disconnect();
      };
    } else {
      // If user is not logged in, disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated]); // Re-run when login status changes

  // ============================================
  // CONTEXT VALUE
  // ============================================
  
  const value = {
    socket,      // Socket.io instance
    connected,   // Connection status
  };

  // ============================================
  // PROVIDE CONTEXT TO CHILDREN
  // ============================================
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK TO USE SOCKET CONTEXT
// ============================================

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  
  return context;
};
