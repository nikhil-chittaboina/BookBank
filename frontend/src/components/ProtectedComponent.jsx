import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Optional: Render a full-page loading spinner while waiting for auth check
    return <div className="p-10 text-center">Loading authentication...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }
  
  // Check Authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect users without the necessary role to the Home page or a 403 Access Denied page
    return <Navigate to="/" replace />; 
  }

  // If authenticated and authorized, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;