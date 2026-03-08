import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import GovDashboard from './pages/GovDashboard';
import CitizenApp from './pages/CitizenApp';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleBasedRoute = ({ children }) => {
  const { isAuthenticated, loading, isGovernment } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isGovernment()) {
    return children;
  }

  return <Navigate to="/citizen" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/gov"
            element={
              <RoleBasedRoute>
                <GovDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/citizen"
            element={
              <ProtectedRoute>
                <CitizenApp />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/citizen" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
