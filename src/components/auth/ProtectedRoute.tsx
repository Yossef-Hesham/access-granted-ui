
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading state if still checking auth
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    // User is authenticated but not admin
    return <Navigate to="/" replace />;
  }

  // User meets all requirements, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
