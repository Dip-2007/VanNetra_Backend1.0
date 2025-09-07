import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import MapComponent from "./components/map/MapComponent";
import OcrProcessor from "./components/ai/OcrProcessor";
import DssEngine from "./components/ai/DssEngine";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// We create an inner component to contain the logic.
// This allows us to use the `useLocation` hook correctly, as it will be inside the `<Router>`.
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // Get the current location

  // Determine if the navbar should be shown based on the route
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    // Load mock data
    fetch("/data/mockData.json")
      .then((response) => response.json())
      .then((data) => {
        setMockData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading mock data:", error);
        setIsLoading(false);
      });

    // Check for user in localStorage
    const storedUser = localStorage.getItem("fraUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("fraUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fraUser");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading FRA Atlas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Conditionally render the Navbar here */}
      {showNavbar && <Navbar user={user} onLogout={handleLogout} />}

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="max-w-3xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      FRA Atlas & WebGIS Decision Support System
                    </h1>
                    <p className="text-xl text-gray-700 animate-in fade-in delay-300 duration-700">
                      Empowering forest-dwelling communities through AI-powered
                      spatial mapping and decision support
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => (window.location.href = "/login")}
                        className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Log In to Access
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          />

          <Route
            path="/login"
            element={<Login onLogin={handleLogin} mockData={mockData} />}
          />

          <Route
            path="/register"
            element={<Register onLogin={handleLogin} />}
          />

          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} mockData={mockData} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/map"
            element={
              user ? (
                <MapComponent user={user} mockData={mockData} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/ocr"
            element={
              user?.role === "admin" ? (
                <OcrProcessor />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/dss"
            element={
              user ? (
                <DssEngine user={user} mockData={mockData} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};


// The main App component now simply provides the Router context.
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;