// BookActions.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { borrowBookApiCall } from '../api/BookApi';


// Helper function to calculate the due date (14 days from now)
const calculateDueDate = () => {
    const today = new Date();
    const twoWeeks = 1000 * 60 * 60 * 24 * 14; 
    return new Date(today.getTime() + twoWeeks).toISOString();
};


const BookActions = ({ bookId, isAvailable, onActionSuccess }) => {
    const navigate = useNavigate();
    const { triggerLoanUpdate, refreshUser } = useAuth(); 
    const [isBorrowing, setIsBorrowing] = useState(false);
    
    const handleBorrow = async () => {
        if (!bookId || isBorrowing || !isAvailable) return;
        setIsBorrowing(true);

        try {
            const dueDate = calculateDueDate();
            console.log(`[BORROW] Starting API call for Book ID: ${bookId}`); // DEBUG LOG
            await borrowBookApiCall(bookId, dueDate); 

            // 1. CRITICAL: Refresh the AUTH user state (updates summary card)
            await refreshUser(); 
            
            // 2. Trigger global flag (forces Profile to check for updates)
            triggerLoanUpdate();

            console.log(`[BORROW] Transaction success. Navigating to /profile.`); // DEBUG LOG
            
            // 3. Show SUCCESS TOAST and redirect
            toast.success('Book successfully borrowed! Check your profile.', { duration: 4000, icon: '📚' });
            navigate('/profile'); 
            
        } catch (err) {
            console.error(`[BORROW FAILED] Error details: ${err.message}`); // DEBUG LOG
            toast.error(err.message || 'Failed to complete borrow transaction.', { duration: 6000, icon: '⚠️' });
        } finally {
            setIsBorrowing(false);
        }
    };

    return (
        <>
            <button 
                className={`
                    action-button borrow-button w-full py-3 mt-4 mb-2 
                    text-white font-semibold rounded-lg transition-colors duration-200
                    ${!isAvailable || isBorrowing 
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'}
                `}
                onClick={handleBorrow}
                disabled={!isAvailable || isBorrowing}
            >
                {isBorrowing ? 'Processing...' : '**Borrow Book**'}
            </button>
            
            <button 
                className={`
                    action-button reserve-button w-full py-3 mb-4 
                    font-semibold rounded-lg border border-blue-600 
                    text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200
                    ${!isAvailable || isBorrowing ? 'opacity-60 cursor-not-allowed border-blue-300 text-blue-400' : ''}
                `}
                disabled={!isAvailable || isBorrowing} 
            >
                Reserve Book
            </button>
        </>
    );
};

export default BookActions;