import React from 'react';
import Header from '../components/Header';
import UserProfileCard from '../components/UserProfileCard';
import LoanTable from '../components/LoanTable';
import {useAuth} from '../context/AuthContext';

// Mock User Data to match the screenshot
// const user = {
//   name: useAuth().user.name,
//   email: useAuth().user.email,
//   memberId: useAuth().user.memberId || 'MB123456',
//   memberSince: useAuth().user.memberSince || '01/15/2022',
//   role: useAuth().user.role
// };

// Mock Data to match the screenshot


const mockSummary = {
  activeBorrows: 1,
  overdueBooks: 0,
  totalFines: 15.50 // Use 15.50 to trigger the warning message
};

const mockCurrentLoans = [
  { bookTitle: "To Kill a Mockingbird", borrowDate: "10/18/2025", dueDate: "11/1/2025", status: "Active", fine: 0.00 }
];

const mockHistoryLoans = [
  { bookTitle: "Pride and Prejudice", borrowDate: "10/11/2025", dueDate: "10/25/2025", returnDate: "10/18/2025", fine: 0.00 },
  { bookTitle: "To Kill a Mockingbird", borrowDate: "10/18/2025", dueDate: "11/1/2025", returnDate: "Not Returned", fine: 0.00 },
];


const Profile = () => {

  const { user: authUser, isLoading } = useAuth();


  if (isLoading || !authUser) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p>Loading user profile...</p>
        </div>
    );
  }
  const profileUser = {
    name: authUser.name,
    email: authUser.email,
    // Safely use optional chaining for properties that might be undefined
    memberId: authUser.memberId || 'MB123456', 
    memberSince: authUser.memberSince || '01/15/2022',
    role: authUser.role
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-500 mt-1 mb-8">Manage your account and borrowed books</p>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Personal Info & Summary */}
          <div className="lg:col-span-1">
            {/* ✅ Use the defined profileUser here */}
            <UserProfileCard user={profileUser} summary={mockSummary} />
          </div>

          {/* Right Column: Loans & History */}
          <div className="lg:col-span-2">
            
            <LoanTable 
              title="Currently Borrowed Books"
              description="Books you have checked out from the library"
              loans={mockCurrentLoans}
              isCurrent={true}
            />
            
            <LoanTable 
              title="Borrowing History"
              description="Your complete borrowing history"
              loans={mockHistoryLoans}
              isCurrent={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;