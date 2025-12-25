/*
 * ============================================
 * CHAT BOX - Real-time Chat Component
 * ============================================
 * 
 * This component displays chat messages and allows sending new messages.
 * 
 * Props:
 * - messages: Array of message objects
 * - onSendMessage: Function to send a new message
 * - currentUser: Current logged-in user
 * 
 * Message object format:
 * {
 *   _id: "message-id",
 *   sender: { _id: "user-id", name: "User Name" },
 *   content: "Message text",
 *   createdAt: "2024-01-01T00:00:00.000Z"
 * }
 */

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Button from "./Button";

const ChatBox = ({ messages = [], onSendMessage, currentUser }) => {
  // ============================================
  // STATE
  // ============================================

  // Store the message being typed
  const [newMessage, setNewMessage] = useState("");

  // Reference to the messages container (for auto-scroll)
  const messagesEndRef = useRef(null);

  // ============================================
  // AUTO-SCROLL TO BOTTOM
  // ============================================
  // Whenever new messages arrive, scroll to bottom

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================================
  // SEND MESSAGE
  // ============================================

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Don't send empty messages
    if (!newMessage.trim()) return;

    // Call the parent's send function
    onSendMessage(newMessage);

    // Clear the input
    setNewMessage("");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Chat</h3>
      </div>

      {/* ============================================
          MESSAGES LIST
          ============================================ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          // Empty state
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          // Display all messages
          messages.map((message) => {
            // Check if this message is from current user
            const isOwnMessage = message.sender._id === currentUser?._id;

            return (
              <div
                key={message._id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${isOwnMessage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {/* Sender name (only for other users' messages) */}
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender.name}
                    </p>
                  )}

                  {/* Message content */}
                  <p className="text-sm">{message.content}</p>

                  {/* Timestamp */}
                  <p className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* ============================================
          MESSAGE INPUT
          ============================================ */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send button */}
          <Button type="submit" className="px-4 bg-green-400">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
