import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/UserProfileCard';
import LoanTable from '../components/LoanTable';
import { fetchUserLoans } from '../api/UserApi'; 

const Profile = () => {
    const { 
        user: authUser, 
        isLoading: isAuthLoading,
        loanUpdateTrigger // Global flag to track loan changes
    } = useAuth(); 
    
    const [loanData, setLoanData] = useState({
        currentLoans: [],
        historyLoans: [],
        summary: { activeBorrows: 0, overdueBooks: 0, totalFines: 0.00 }
    });
    const [isLoading, setIsLoading] = useState(true);

    const loadLoanData = useCallback(async () => {
        if (!authUser) return;
        setIsLoading(true);
        console.log(`[PROFILE FETCH] Starting loan data fetch.`); // DEBUG LOG
        
        try {
            const data = await fetchUserLoans();
            setLoanData(data);
            console.log(`[PROFILE FETCH SUCCESS] Loans received: ${data.currentLoans.length} active loans.`); // DEBUG LOG
            
        } catch (error) {
            console.error("PROFILE FETCH ERROR:", error);
        } finally {
            setIsLoading(false);
        }
    }, [authUser]);

    // This runs the fetch when the component mounts or when the global trigger changes
    useEffect(() => {
        console.log(`[PROFILE RENDER] useEffect fired. Current trigger value: ${loanUpdateTrigger}`); // DEBUG LOG
        loadLoanData();
    }, [loadLoanData, loanUpdateTrigger]); 


    if (isAuthLoading || !authUser || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>Loading user profile and loans...</p>
            </div>
        );
    }
    
    const profileUser = {
        name: authUser.name,
        email: authUser.email,
        memberId: authUser.memberId || 'MB123456', 
        memberSince: authUser.memberSince || new Date(authUser.createdAt).toLocaleDateString(),
        role: authUser.role
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
                <p className="text-gray-500 mt-1 mb-8">Manage your account and borrowed books</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Personal Info & Summary */}
                    <div className="lg:col-span-1">
                        <UserProfileCard user={profileUser} summary={loanData.summary} />
                    </div>

                    {/* Right Column: Loans & History */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        <LoanTable 
                            title="Currently Borrowed Books"
                            description="Books you have checked out from the library"
                            loans={loanData.currentLoans}
                            isCurrent={true}
                            onReturnSuccess={loadLoanData} 
                        />
                        
                        <LoanTable 
                            title="Borrowing History"
                            description="Your complete borrowing history"
                            loans={loanData.historyLoans}
                            isCurrent={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;