import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};