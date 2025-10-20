import React, { useState } from'react';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import AdminBookTable from '../components/AdminBookTable';
// Placeholder for other admin tables
// import AdminUserTable from '../components/AdminUserTable'; 
// import AdminBorrowedTable from '../components/AdminBorrowedTable'; 

const mockMetrics = [
  { title: "Total Books", value: 57 },
  { title: "Borrowed", value: 1 },
  { title: "Active Users", value: 3 },
  { title: "Total Fines", value: 16, unit: '$' },
];

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState('Books Management');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Books Management':
        return <AdminBookTable />;
      case 'Users Management':
        return <div className="p-6 bg-white rounded-xl shadow-lg">Users Management Content Here</div>;
      case 'Borrowed Books':
        return <div className="p-6 bg-white rounded-xl shadow-lg">Borrowed Books Table/List Here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500 mt-1 mb-8">Manage books, users, and library operations</p>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockMetrics.map((metric, index) => (
            <DashboardCard key={index} {...metric} />
          ))}
        </div>

        {/* Management Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-300 space-x-4">
            {['Books Management', 'Users Management', 'Borrowed Books'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition duration-150 ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashBoard;