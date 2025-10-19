import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // You will need this for API integration

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initial state: Not logged in (false), but checking (true)
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Initial Authentication Check (Token Validation) ---
  useEffect(() => {
    // FIX: Use setTimeout to ensure the state change happens after the initial render cycle,
    // gracefully handling the 'isLoading' state.
    const checkAuthStatus = () => {
        // ⚠️ TODO: INTEGRATE BACKEND TOKEN CHECK HERE
        
        // Finalize state: Authentication check is complete.
        setIsLoading(false); 
    };

    const timeoutId = setTimeout(checkAuthStatus, 100); // Small delay to prevent race conditions

    return () => clearTimeout(timeoutId); // Cleanup function
  }, []);

  const login = (userData) => {
    // This is called AFTER your successful POST /api/auth/login API call
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // 1. You must integrate your API call here to clear the cookie/token on the backend
    // Example: axios.post('/api/auth/logout'); 
    
    // 2. Clear local state
    setUser(null);
    setIsAuthenticated(false);
    
    // 3. Redirect to login page
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};