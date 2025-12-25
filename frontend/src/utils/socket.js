/*
 * ============================================
 * SOCKET SERVICE - Real-time Communication
 * ============================================
 * 
 * This file sets up Socket.io for real-time features like:
 * - Live code editing
 * - Chat messages
 * - User presence (who's online)
 * - Video call signaling
 * 
 * What is Socket.io?
 * It's a library that allows real-time, bidirectional communication
 * between the browser and server. Think of it like a phone call
 * instead of sending letters (HTTP requests).
 */

import { io } from "socket.io-client";

// ============================================
// CONFIGURATION
// ============================================

// Backend server URL (where Socket.io server is running)
const SOCKET_URL = "http://localhost:3000";

// ============================================
// CREATE SOCKET CONNECTION
// ============================================

/**
 * Initialize Socket.io connection
 * This function creates and returns a socket instance
 * 
 * @returns {Socket} Socket.io client instance
 */
export const initializeSocket = () => {
  // Create socket connection
  const socket = io(SOCKET_URL, {
    // Send cookies with the connection (for authentication)
    withCredentials: true,
    
    // Automatically try to reconnect if connection is lost
    reconnection: true,
    
    // Try to reconnect every 5 seconds
    reconnectionDelay: 5000,
    
    // Maximum reconnection attempts
    reconnectionAttempts: 5,
  });

  // ============================================
  // CONNECTION EVENT LISTENERS
  // ============================================

  // When successfully connected to server
  socket.on("connect", () => {
    console.log("✅ Connected to Socket.io server");
    console.log("Socket ID:", socket.id);
  });

  // When disconnected from server
  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from server:", reason);
  });

  // When connection error occurs
  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
  });

  // When trying to reconnect
  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
  });

  // When successfully reconnected
  socket.on("reconnect", (attemptNumber) => {
    console.log(`✅ Reconnected after ${attemptNumber} attempts`);
  });

  return socket;
};

// ============================================
// SOCKET EVENT HELPERS
// ============================================

/**
 * Join a room
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID to join
 */
export const joinRoomSocket = (socket, roomId) => {
  socket.emit("join_room", { roomId });
  console.log(`📥 Joining room: ${roomId}`);
};

/**
 * Leave a room
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID to leave
 */
export const leaveRoomSocket = (socket, roomId) => {
  socket.emit("leave_room", { roomId });
  console.log(`📤 Leaving room: ${roomId}`);
};

/**
 * Send code change
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {string} code - Code content
 */
export const sendCodeChange = (socket, roomId, code) => {
  socket.emit("code_change", { roomId, code });
};

/**
 * Send cursor position
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {Object} position - Cursor position { line, column }
 */
export const sendCursorPosition = (socket, roomId, position) => {
  socket.emit("cursor_position", { roomId, position });
};

/**
 * Send chat message
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {string} message - Message content
 */
export const sendMessage = (socket, roomId, message) => {
  socket.emit("send_message", { roomId, message });
  console.log(`💬 Sending message to room ${roomId}`);
};

/**
 * Change programming language
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {string} language - Programming language
 */
export const changeLanguage = (socket, roomId, language) => {
  socket.emit("language_change", { roomId, language });
  console.log(`🔄 Changing language to: ${language}`);
};

/**
 * Send typing indicator (user started typing)
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 */
export const sendTypingStart = (socket, roomId) => {
  socket.emit("typing_start", { roomId });
};

/**
 * Send typing indicator (user stopped typing)
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 */
export const sendTypingStop = (socket, roomId) => {
  socket.emit("typing_stop", { roomId });
};

// ============================================
// WEBRTC SIGNALING HELPERS
// ============================================

/**
 * Send WebRTC offer (start video call)
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {Object} offer - WebRTC offer
 */
export const sendWebRTCOffer = (socket, roomId, offer) => {
  socket.emit("webrtc_offer", { roomId, offer });
  console.log("📹 Sending WebRTC offer");
};

/**
 * Send WebRTC answer (accept video call)
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {Object} answer - WebRTC answer
 */
export const sendWebRTCAnswer = (socket, roomId, answer) => {
  socket.emit("webrtc_answer", { roomId, answer });
  console.log("📹 Sending WebRTC answer");
};

/**
 * Send ICE candidate (network path for WebRTC)
 * @param {Socket} socket - Socket instance
 * @param {string} roomId - Room ID
 * @param {Object} candidate - ICE candidate
 */
export const sendICECandidate = (socket, roomId, candidate) => {
  socket.emit("webrtc_ice_candidate", { roomId, candidate });
};

// Export default for easy import
export default initializeSocket;
