import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    const [loanUpdateTrigger, setLoanUpdateTrigger] = useState(0);

    const triggerLoanUpdate = () => {
        setLoanUpdateTrigger(prev => prev + 1);
    };

    // NEW: Function to force a global user data refresh
    const refreshUser = useCallback(async () => {
        try {
            const response = await fetch(API_URL, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Updates the user state globally
                setIsAuthenticated(true);
                return data.user;
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Failed to refresh user profile:", error);
        }
    }, []);

    // Initial Authentication Check (Cookie Validation)
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true); 
            await refreshUser();
            setIsLoading(false); 
        };

        checkAuthStatus();
    }, [refreshUser]); 

    // --- Authentication Actions ---

    const login = async ({ email, password }) => {
        try {
            const response= await fetch(LOGIN_URL,{
                method:"POST",
                headers:{ "Content-Type":"application/json" },
                body:JSON.stringify({email,password}),
                credentials:'include' 
            });

            if(!response.ok){
                console.error("Login failed with status:",response.status);
                toast.error("Login failed. Please check credentials.");
                return;
            }

            const data=await response.json();
            
            toast.success("Login successful!");
            setUser(data.user); 
            setIsAuthenticated(true);
            navigate("/catalog");

        } catch (error) {
            toast.error("An error occurred during login.");
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        try{
            await fetch(LOGOUT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials:'include',
            });

            setUser(null);
            setIsAuthenticated(false);
            
            toast.success("Logged out successfully.");
            navigate('/'); 
        }catch(error){
            console.error("Logout error:",error);
            toast.error("Network error occurred during logout.");
        }
    };

    // --- Context Value ---
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
        triggerLoanUpdate, 
        loanUpdateTrigger
    };

    // --- Provider Component Return ---
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};