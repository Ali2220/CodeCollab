import { Link } from "react-router-dom";
import { Code2, Users, Video, Sparkles } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

/**
 * Home/Landing Page
 * - App ka pehla page
 * - Features showcase
 * - CTA buttons (Login/Register ya Dashboard)
 */
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-blue-100">
      {/* Navbar */}
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

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-green-400">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="secondary">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Code Together,
            <span className="text-primary-600"> Build Faster</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Real-time collaborative coding platform with AI assistance. Write
            code together, review instantly, and ship faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="text-lg px-8 py-3 bg-green-400">Open Dashboard →</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button className="text-lg px-8 py-3 bg-green-400">Start Free →</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="text-lg px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {/* Feature 1: Real-time Coding */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Coding</h3>
            <p className="text-gray-600">
              Code together in real-time with live cursor tracking and instant
              updates.
            </p>
          </div>

          {/* Feature 2: AI Assistant */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Get instant code suggestions, reviews, and explanations powered by
              AI.
            </p>
          </div>

          {/* Feature 3: Video Calls */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Calls</h3>
            <p className="text-gray-600">
              Built-in video calls for pair programming and code reviews.
            </p>
          </div>

          {/* Feature 4: Team Collaboration */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Invite your team, share rooms, and collaborate seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2026 CodeCollab. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
