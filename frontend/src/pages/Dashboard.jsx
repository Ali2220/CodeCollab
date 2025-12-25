/*
 * ============================================
 * DASHBOARD PAGE
 * ============================================
 * 
 * This is the main page after login. It shows:
 * - User's rooms
 * - Create new room button
 * - Join existing room button
 * 
 * Flow:
 * 1. Load user's rooms from backend
 * 2. Display rooms in a grid
 * 3. Allow creating new room
 * 4. Allow joining room by ID
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, LogOut, Plus, User, Users, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import * as api from "../utils/api";

const Dashboard = () => {
  // ============================================
  // HOOKS
  // ============================================

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ============================================
  // STATE
  // ============================================

  // List of user's rooms
  const [rooms, setRooms] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Show create room modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Show join room modal
  const [showJoinModal, setShowJoinModal] = useState(false);

  // New room form data
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    language: "javascript",
  });

  // Room ID to join
  const [joinRoomId, setJoinRoomId] = useState("");

  // ============================================
  // LOAD ROOMS ON PAGE LOAD
  // ============================================

  useEffect(() => {
    loadRooms();
  }, []);

  // ============================================
  // LOAD ROOMS FUNCTION
  // ============================================

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      toast.error("Failed to load rooms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE LOGOUT
  // ============================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ============================================
  // CREATE ROOM
  // ============================================

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    try {
      const room = await api.createRoom(newRoom);
      toast.success("Room created successfully!");
      setShowCreateModal(false);
      setNewRoom({ name: "", description: "", language: "javascript" });

      // Navigate to the new room
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      toast.error(error.message || "Failed to create room");
    }
  };

  // ============================================
  // JOIN ROOM
  // ============================================

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (!joinRoomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    try {
      await api.joinRoom(joinRoomId);
      toast.success("Joined room successfully!");
      setShowJoinModal(false);
      setJoinRoomId("");

      // Navigate to the room
      navigate(`/room/${joinRoomId}`);
    } catch (error) {
      toast.error(error.message || "Failed to join room");
    }
  };

  // ============================================
  // DELETE ROOM
  // ============================================

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await api.deleteRoom(roomId);
      toast.success("Room deleted successfully!");
      loadRooms(); // Reload rooms
    } catch (error) {
      toast.error(error.message || "Failed to delete room");
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================
          NAVBAR
          ============================================ */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              <span className="text-lg sm:text-xl font-bold sm:inline">CodeCollab</span>
            </div>

            {/* User info and logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-none">{user?.name}</span>
              </div>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 text-xs sm:text-base"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-primary-100">
            Ready to collaborate? Create a new room or join an existing one.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Create Room Card */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg p-4 sm:p-6 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Create New Room</h3>
                <p className="text-sm sm:text-base text-gray-600">Start a new coding session</p>
              </div>
              <div className="bg-primary-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
            </div>
            <Button
              className="w-full bg-green-400 text-sm sm:text-base"
              onClick={() => setShowCreateModal(true)}
            >
              Create Room
            </Button>
          </div>

          {/* Join Room Card */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg p-4 sm:p-6 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Join Room</h3>
                <p className="text-sm sm:text-base text-gray-600">Enter a room code to join</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full text-sm sm:text-base"
              onClick={() => setShowJoinModal(true)}
            >
              Join Room
            </Button>
          </div>
        </div>

        {/* My Rooms Section */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">My Rooms</h2>

          {loading ? (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl shadow-md">
              <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No rooms yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                Create your first room to start collaborating
              </p>
              <Button className="w-full bg-green-400 max-w-xs mx-auto text-sm sm:text-base" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 inline mr-2" />
                Create Your First Room
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{room.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {room.description || "No description"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to room when deleting
                        handleDeleteRoom(room.roomId);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                      title="Delete room"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{room.participants?.length || 0} members</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {room.language}
                    </span>
                  </div>

                  <Button
                    className="w-full text-sm sm:text-base bg-green-400"
                    onClick={() => navigate(`/room/${room.roomId}`)}
                  >
                    Open Room
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          CREATE ROOM MODAL
          ============================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Room</h2>
            <form onSubmit={handleCreateRoom}>
              <Input
                label="Room Name"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                required
                placeholder="e.g., JavaScript Study Group"
              />
              <Input
                label="Description"
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
                placeholder="Optional description"
              />
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Language
                </label>
                <select
                  value={newRoom.language}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-400">
                  Create
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          JOIN ROOM MODAL
          ============================================ */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Join Room</h2>
            <form onSubmit={handleJoinRoom}>
              <Input
                label="Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                required
                placeholder="Enter room ID"
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Join
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
