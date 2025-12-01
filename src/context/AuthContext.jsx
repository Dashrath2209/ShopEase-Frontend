import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser({
        username: data.username,
        email: data.email,
        role: data.role,
      });
      toast.success('Login successful!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser({
        username: data.username,
        email: data.email,
        role: data.role,
      });
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};