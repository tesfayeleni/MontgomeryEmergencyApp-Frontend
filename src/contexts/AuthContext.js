import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      setError(null);
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      setUser(null);
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_role', response.data.role);
      await loadUser();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const response = await authService.register(name, email, password, role);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_role', response.data.role);
      await loadUser();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    setUser(null);
  };

  const isGovernment = () => {
    const role = localStorage.getItem('user_role');
    return ['police_admin', 'fire_admin', 'emergency_manager'].includes(role);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isGovernment,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
