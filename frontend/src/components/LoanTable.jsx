import React, { useState } from 'react'; // Added useState for local loading state
import { RotateCcw, Book } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import toast for user feedback
import { returnBookApiCall } from '../api/UserApi'; // Import the return API call

const LoanTable = ({ title, description, loans, isCurrent = false, onReturnSuccess }) => {
    // State to track loading status of a specific return action
    const [isReturning, setIsReturning] = useState(null); // Stores loanId being processed

    const isLoansEmpty = !loans || loans.length === 0;

    // --- API HANDLER FOR RETURN ---
    const handleReturn = async (loanId, bookId) => {
        if (!window.confirm("Are you sure you want to return this book? This action cannot be undone.")) return;
        
        setIsReturning(loanId);
        
        try {
            // Note: The backend expects bookId in the URL path, so we pass it to the API utility
            const result = await returnBookApiCall(bookId); 
            
            toast.success(
                `Returned! Fine assessed: $${result.fine ? parseFloat(result.fine).toFixed(2) : '0.00'}.`, 
                { icon: '✅', duration: 5000 }
            );

            // CRITICAL: Call the function passed from the Profile page to reload the loan data
            if (onReturnSuccess) {
                onReturnSuccess();
            }

        } catch (error) {
            console.error("Return failed:", error);
            // Check if the error message contains a specific reason from the backend
            const userFacingError = error.message.includes('User profile') || error.message.includes('No active loan') 
                ? error.message 
                : 'Return failed due to network error.';
                
            toast.error(userFacingError, {
                icon: '❌',
                duration: 6000,
            });
        } finally {
            setIsReturning(null);
        }
    };
    // ----------------------------

    // Function to render the correct Status Badge
    const StatusBadge = ({ status }) => {
        let colorClass;
        let label = status.toUpperCase();

        if (status === 'Active' || status === 'AVAILABLE') {
            colorClass = 'bg-green-100 text-green-700';
            label = 'ACTIVE';
        } else if (status === 'Not Returned' || status === 'OVERDUE') {
            colorClass = 'bg-red-100 text-red-700';
            label = status;
        } else {
            colorClass = 'bg-gray-100 text-gray-700';
        }

        return (
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                {label}
            </span>
        );
    };

    // Custom Empty State Content
    const EmptyContent = () => {
        // ... (Empty Content logic remains the same)
        if (isCurrent) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                    <Book className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="mb-6">You haven't borrowed any books yet</p>
                    <Link 
                        to="/catalog"
                        className="flex items-center text-sm px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        Browse Catalog
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                    <p className="text-gray-500">No borrowing history</p>
                </div>
            );
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{description}</p>

            {isLoansEmpty ? (
                <EmptyContent />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                                <th className="px-4 py-3">Book Title</th>
                                <th className="px-4 py-3">Borrow Date</th>
                                <th className="px-4 py-3">Due Date</th>
                                {isCurrent && <th className="px-4 py-3">Status</th>}
                                {!isCurrent && <th className="px-4 py-3">Return Date</th>}
                                <th className="px-4 py-3">Fine</th>
                                {isCurrent && <th className="px-4 py-3">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loans.map((loan) => (
                                <tr key={loan.loanId} className="hover:bg-gray-50 text-sm">
                                    <td className="px-4 py-3 font-medium text-gray-800">{loan.bookTitle}</td>
                                    <td className="px-4 py-3 text-gray-600">{loan.borrowDate}</td>
                                    <td className="px-4 py-3 text-gray-600">{loan.dueDate}</td>
                                    
                                    {/* Status Column (Current Loans) */}
                                    {isCurrent && <td className="px-4 py-3"><StatusBadge status={loan.status} /></td>}
                                    
                                    {/* Return Date Column (History) */}
                                    {!isCurrent && (
                                        <td className={`px-4 py-3 ${loan.returnDate === 'Not Returned' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                                            {loan.returnDate}
                                        </td>
                                    )}

                                    {/* Fine Column */}
                                    <td className="px-4 py-3 text-gray-600">${parseFloat(loan.fine).toFixed(2)}</td>
                                    
                                    {/* Action Column (Return Button) */}
                                    {isCurrent && (
                                        <td className="px-4 py-3">
                                            <button 
                                                // 🎯 CRITICAL: Hook up the actual return handler
                                                onClick={() => handleReturn(loan.loanId, loan.bookId)}
                                                disabled={isReturning === loan.loanId}
                                                className="flex items-center text-sm px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" />
                                                {isReturning === loan.loanId ? 'Processing...' : 'Return'}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LoanTable;