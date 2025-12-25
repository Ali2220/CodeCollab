/*
 * ============================================
 * ROOM PAGE - Collaborative Coding Room
 * ============================================
 * 
 * This is the main collaboration page where users:
 * - Edit code together in real-time
 * - Chat with each other
 * - Make video calls
 * - Use AI features
 * 
 * Layout:
 * - Left side: Code editor
 * - Right side: Chat, Video, AI panels (tabs)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Code2, MessageSquare, Video, Sparkles, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import CodeEditor from "../components/CodeEditor";
import ChatBox from "../components/ChatBox";
import VideoCall from "../components/VideoCall";
import AIPanel from "../components/AIPanel";
import Button from "../components/Button";
import * as api from "../utils/api";
import * as socketUtils from "../utils/socket";
import { LANGUAGES } from "../utils/constants";

const Room = () => {
  // ============================================
  // HOOKS
  // ============================================

  const { roomId } = useParams(); // Get room ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected } = useSocket();

  // ============================================
  // STATE
  // ============================================

  // Room data
  const [room, setRoom] = useState(null);

  // Code content
  const [code, setCode] = useState("// Start coding here...");

  // Programming language
  const [language, setLanguage] = useState("javascript");

  // Chat messages
  const [messages, setMessages] = useState([]);

  // Active right panel ('chat', 'video', 'ai')
  const [activePanel, setActivePanel] = useState("chat");

  // Loading state
  const [loading, setLoading] = useState(true);

  // ============================================
  // LOAD ROOM DATA
  // ============================================

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const roomData = await api.getRoomById(roomId);
      setRoom(roomData);
      setCode(roomData.currentCode);
      setLanguage(roomData.language);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load room");
      navigate("/dashboard");
    }
  };

  // ============================================
  // SOCKET.IO - JOIN ROOM
  // ============================================

  useEffect(() => {
    if (socket && connected && roomId) {
      // Join the room
      socketUtils.joinRoomSocket(socket, roomId);

      // Listen for room data
      socket.on("room_data", (data) => {
        setCode(data.currentCode);
        setLanguage(data.language);
      });

      // Listen for code updates from other users
      socket.on("code_update", (data) => {
        setCode(data.code);
      });

      // Listen for language changes
      socket.on("language_updated", (data) => {
        setLanguage(data.language);
        toast.success(`Language changed to ${data.language} by ${data.changedBy}`);
      });

      // Listen for new chat messages
      socket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Listen for user joined
      socket.on("user_joined", (data) => {
        toast.success(data.message);
      });

      // Listen for user left
      socket.on("user_left", (data) => {
        toast.info(data.message);
      });

      // Cleanup: leave room when component unmounts
      return () => {
        socketUtils.leaveRoomSocket(socket, roomId);
        socket.off("room_data");
        socket.off("code_update");
        socket.off("language_updated");
        socket.off("receive_message");
        socket.off("user_joined");
        socket.off("user_left");
      };
    }
  }, [socket, connected, roomId]);

  // ============================================
  // HANDLE CODE CHANGE
  // ============================================

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // Send code change to other users via Socket.io
    if (socket && connected) {
      socketUtils.sendCodeChange(socket, roomId, newCode);
    }
  };

  // ============================================
  // HANDLE LANGUAGE CHANGE
  // ============================================

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);

    // Send language change to other users
    if (socket && connected) {
      socketUtils.changeLanguage(socket, roomId, newLanguage);
    }
  };

  // ============================================
  // SAVE CODE
  // ============================================

  const handleSaveCode = async () => {
    try {
      await api.saveCode(roomId, {
        content: code,
        language,
        changeDescription: "Manual save",
      });
      toast.success("Code saved successfully!");
    } catch (error) {
      toast.error("Failed to save code");
    }
  };

  // ============================================
  // SEND CHAT MESSAGE
  // ============================================

  const handleSendMessage = (message) => {
    if (socket && connected) {
      socketUtils.sendMessage(socket, roomId, message);
    }
  };

  // ============================================
  // LEAVE ROOM
  // ============================================

  const handleLeaveRoom = () => {
    navigate("/dashboard");
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ============================================
          TOP BAR
          ============================================ */}
      <div className="bg-white shadow-md px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-wrap gap-2">
        {/* Left: Room info */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <Button variant="secondary" onClick={handleLeaveRoom} className="px-2 sm:px-3 flex-shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold truncate">{room?.name}</h1>
            <p className="text-xs sm:text-sm text-gray-600 truncate">Room ID: {roomId}</p>
          </div>
        </div>

        {/* Right: Language selector and save button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-2 sm:px-3 py-1 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-base"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Save button */}
          <Button onClick={handleSaveCode} className="flex items-center space-x-1 sm:space-x-2 bg-green-400 px-2 sm:px-4 text-xs sm:text-base">
            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* ============================================
          MAIN CONTENT AREA
          ============================================ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ============================================
            LEFT SIDE - CODE EDITOR
            ============================================ */}
        <div className="flex-1 p-2 sm:p-4 min-h-0">
          <div className="h-full bg-white rounded-lg shadow-md overflow-hidden">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
            />
          </div>
        </div>

        {/* ============================================
            RIGHT SIDE - PANELS (Chat, Video, AI)
            ============================================ */}
        <div className="w-full lg:w-96 p-2 sm:p-4 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none">
          {/* Panel tabs */}
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-4 flex-wrap">
            <button
              onClick={() => setActivePanel("chat")}
              className={`flex-1 min-w-[70px] flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-base ${activePanel === "chat"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActivePanel("video")}
              className={`flex-1 min-w-[70px] flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-base ${activePanel === "video"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Video className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setActivePanel("ai")}
              className={`flex-1 min-w-[70px] flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-base ${activePanel === "ai"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>AI</span>
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden min-h-0">
            {activePanel === "chat" && (
              <ChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={user}
              />
            )}
            {activePanel === "video" && (
              <VideoCall socket={socket} roomId={roomId} currentUser={user} />
            )}
            {activePanel === "ai" && <AIPanel code={code} language={language} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
