import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // 1. Handle Loading State
  // While the initial authentication check (e.g., checking for a token/cookie) is running,
  // render a loading screen to prevent flickering.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-indigo-600">Checking credentials...</div>
      </div>
    );
  }
  
  // 2. Handle Unauthenticated State
  // If the check is done and the user is NOT authenticated, redirect to login.
  if (!isAuthenticated) {
    // 'replace' ensures the user can't navigate back to the protected page via the browser history
    return <Navigate to="/login" replace />;
  }
  
  // 3. Handle Unauthorized Role State
  // If the user is authenticated but their role is not in the allowedRoles array.
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Log the unauthorized attempt (for console clarity)
    console.warn(`Access denied for user role: ${user.role}. Required roles: ${allowedRoles.join(', ')}`);
    
    // Redirect unauthorized user to a safe, general page (e.g., Home or a 403 page)
    return <Navigate to="/" replace />; 
  }

  // 4. Success State
  // If authenticated and authorized, render the child component content via the Outlet.
  return <Outlet />;
};

export default ProtectedRoute;