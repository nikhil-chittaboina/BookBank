import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/auth/validate-token'; 
const LOGIN_URL = 'http://localhost:5000/api/auth/login'; 
const LOGOUT_URL = 'http://localhost:5000/api/auth/logout'; 

// --- 1. Define the Context ---
const AuthContext = createContext(null);

// --- 2. Custom Hook to Consume Context ---
export const useAuth = () => useContext(AuthContext);

// --- 3. The AuthProvider Component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Initial Authentication Check (Cookie Validation) ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true); 

      try {
        // The browser automatically includes the HTTP-only cookie.
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // CRITICAL: Includes cookies with the request
        });

        if (response.ok) { 
          // SUCCESS: Backend found a valid cookie.
          const data = await response.json();
          setUser(data.user); // Re-hydrate the user state
          setIsAuthenticated(true);
        } else {
          // FAILURE: Cookie is invalid, expired, or missing (e.g., 401/403)
          // State remains null/false, ready to show public content.
          console.error("Cookie validation failed with status:", response.status);
        }
      } catch (error) {
        // NETWORK ERROR: Server unreachable
        toast.error("Network error during auth check.");
      } finally {
        // The check is complete, allow app to render.
        setIsLoading(false); 
      }
    };

    checkAuthStatus();
    
  }, []); // Runs only ONCE on mount

  // --- Authentication Actions (Simulated) ---

  const login = async ({ email, password }) => {
   
    try {
      // MOCK SUCCESS (Replace with real API response processing)
      console.log('Login attempt:', { email, password });
      const response= await fetch('http://localhost:5000/api/auth/login',{
          method:"POST",
          headers:{ 
              "Content-Type":"application/json" 
          },
          body:JSON.stringify({email,password}),
          credentials:'include' // Important to include cookies
      });

      if(!response.ok){
          // Handle error (e.g., show message to user)
          // in case if credentials are wrong this block will execute
          console.error("Login failed with status:",response.status);
          toast.error("Login failed. Please try again.");
          return;
      }

      const data=await response.json();
      
      toast.success("Login successful!");
    //  const role=data.user.role;
      // Redirect based on role
      // navigate(role==='admin'?'/admin/dashboard':"/user/dashboard");
      setUser(data.user);
      setIsAuthenticated(true);
      navigate("/catalog");


  } catch (error) {
    // server down or network error
     toast.error("An error occurred during login.");
     console.error("Login failed:", error);
     
  }
    
    
  
  };

  const logout = async () => {
    // 1. Invalidate the session/cookie on the backend
    try{

    const response = await fetch(LOGOUT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
    });
    if(!response.ok){
      console.error("Logout failed with status:",response.status);
      toast.error("Logout failed. Please try again.");
      return;
    }


    // 2. Clear local state
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success("Logged out successfully.");
    navigate('/'); 
    }catch(error){
      console.error("Logout error:",error);
      toast.error("Network error occurred during logout.");
    }
    
    // 3. Redirect to login page
  
  };

  // --- Context Value ---
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  // --- Provider Component Return ---
  // The children (the rest of your application) can now access 'value'
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};