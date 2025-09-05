import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Atlas from './pages/Atlas';
import DecisionSupport from './pages/DecisionSupport';
import Records from './pages/Records';


const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/dss" element={<DecisionSupport />} />
            <Route path="/records" element={<Records />} />
            <Route path="/asset-mapping" element={<div className="text-center py-12 text-gray-500">Asset Mapping Module (Coming Soon)</div>} />
            <Route path="/analytics" element={<div className="text-center py-12 text-gray-500">Advanced Analytics (Coming Soon)</div>} />
            <Route path="/users" element={<div className="text-center py-12 text-gray-500">User Management (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="text-center py-12 text-gray-500">System management (Coming Soon)</div>} />
            <Route path="/my-land" element={<div className="text-center py-12 text-gray-500">My Land View (Coming Soon)</div>} />
            <Route path="/schemes" element={<div className="text-center py-12 text-gray-500">Eligible Schemes (Coming Soon)</div>} />
            <Route path="/status" element={<div className="text-center py-12 text-gray-500">Application Status (Coming Soon)</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;