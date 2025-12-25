import { useNavigate } from "react-router-dom";
import { Code2, LogOut, Plus, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

/**
 * Dashboard Page (Protected)
 * - User yahan login ke baad aata hai
 * - User apni rooms dekh sakta hai
 * - Naye room create kar sakta hai
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                CodeCollab
              </span>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-primary-100">
            Ready to collaborate? Create a new room or join an existing one.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Room Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Create New Room</h3>
                <p className="text-gray-600">Start a new coding session</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <Button className="w-full mt-4">Create Room</Button>
          </div>

          {/* Join Room Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Join Room</h3>
                <p className="text-gray-600">Enter a room code to join</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Code2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-4">
              Join Room
            </Button>
          </div>
        </div>

        {/* Recent Rooms Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Rooms</h2>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No rooms yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first room to start collaborating
            </p>
            <Button>
              <Plus className="w-4 h-4 inline mr-2" />
              Create Your First Room
            </Button>
          </div>

          {/* Future: Room List will be displayed here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
