import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but user is not admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // User is authorized
  return children;
};

export default ProtectedRoute;