import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Context
import { AuthProvider, useAuth } from './components/context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Page/View Components
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import MapComponent from './components/map/MapComponent';
import DssEngine from './components/ai/DssEngine';
import OcrProcessor from './components/ai/OcrProcessor';

/**
 * A layout component for authenticated users. It includes the sidebar, navbar,
 * and an <Outlet> for rendering the specific page content.
 */
const PrivateLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Child routes will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/**
 * Main component for handling application routing.
 * It conditionally renders routes based on the authentication status.
 */
const AppRoutes = () => {
  const { isAuthenticated, user, mockData, login } = useAuth();

  return (
    <Routes>
      {isAuthenticated ? (
        // If authenticated, render the main application layout with nested routes
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard user={user} mockData={mockData} />} />
          <Route path="/map" element={<MapComponent user={user} mockData={mockData} />} />
          <Route path="/dss" element={<DssEngine user={user} mockData={mockData} />} />
          <Route path="/ocr" element={<OcrProcessor />} />
          <Route path="/records" element={<Navigate to="/ocr" replace />} />
          {/* Any other authenticated route will redirect to the dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        // If not authenticated, only show the login route
        <>
          <Route path="/login" element={<Login onLogin={login} mockData={mockData} />} />
          {/* Any other route will redirect to the login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;

