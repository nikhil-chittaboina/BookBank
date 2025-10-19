import React from 'react';
// Corrected import: RotateCcw for return action, Book for empty state
import { RotateCcw, Book } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const LoanTable = ({ title, description, loans, isCurrent = false }) => {
  const isLoansEmpty = loans.length === 0;

  // Function to render the correct Status Badge
  const StatusBadge = ({ status }) => {
    let colorClass;
    let label = status.toUpperCase();

    if (status === 'Active') {
      colorClass = 'bg-green-100 text-green-700';
    } else if (status === 'Not Returned' || status === 'Overdue') {
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
    if (isCurrent) {
      // Empty state for CURRENTLY BORROWED
      return (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <Book className="w-16 h-16 mb-4 text-gray-300" />
          <p className="mb-6">You haven't borrowed any books yet</p>
          {/* Link to Catalog Page */}
          <Link 
            to="/catalog"
            className="flex items-center text-sm px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Catalog
          </Link>
        </div>
      );
    } else {
      // Empty state for BORROWING HISTORY
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
              {loans.map((loan, index) => (
                <tr key={index} className="hover:bg-gray-50 text-sm">
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
                        className="flex items-center text-sm px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        onClick={() => console.log(`Returning book: ${loan.bookTitle}`)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> {/* <-- CORRECT ICON */}
                        Return
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