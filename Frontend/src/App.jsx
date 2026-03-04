import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import NotFound from "./components/common/NotFound";
import LoadingSpinner from "./components/common/LoadingSpinner";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Profile Complete Check Route
function ProfileCompleteRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.profileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes - Require Auth */}
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Require Auth + Profile Complete */}
          <Route
            path="/dashboard"
            element={
              <ProfileCompleteRoute>
                <Dashboard />
              </ProfileCompleteRoute>
            }
          />

          <Route
            path="/discover"
            element={
              <ProfileCompleteRoute>
                <Discover />
              </ProfileCompleteRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProfileCompleteRoute>
                <Profile />
              </ProfileCompleteRoute>
            }
          />

          <Route
            path="/profile/:userId"
            element={
              <ProfileCompleteRoute>
                <Profile />
              </ProfileCompleteRoute>
            }
          />

          <Route
            path="/connections"
            element={
              <ProfileCompleteRoute>
                <Connections />
              </ProfileCompleteRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
