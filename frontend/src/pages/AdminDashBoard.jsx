import React, { useEffect, useState } from'react';
import toast from 'react-hot-toast';
import DashboardCard from '../components/DashboardCard';
import AdminBookTable from '../components/AdminBookTable';
// Placeholder for other admin tables
// import AdminUserTable from '../components/AdminUserTable'; 
// import AdminBorrowedTable from '../components/AdminBorrowedTable'; 

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState('Books Management');
  const [metrics, setMetrics] = useState([
    { title: "Total Books", value: 0 },
    { title: "Borrowed", value: 0 },
    { title: "Active Users", value: 0 },
    { title: "Total Fines", value: 0, unit: '$' },
  ]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load analytics');
      }

      setMetrics([
        { title: "Total Books", value: data.metrics.totalBooks },
        { title: "Borrowed", value: data.metrics.borrowedBooks },
        { title: "Active Users", value: data.metrics.activeUsers },
        { title: "Total Fines", value: data.metrics.totalFines, unit: '$' },
      ]);
      setPopularBooks(data.popularBooks || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const runMetadataEnrichment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/enrich-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enrich books');
      }
      toast.success(data.message || 'Book metadata updated.');
      loadAnalytics();
    } catch (error) {
      toast.error(error.message || 'Failed to enrich books');
    }
  };

  const runCoverEnrichment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/enrich-covers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enrich covers');
      }
      toast.success(data.message || 'Book covers updated.');
    } catch (error) {
      toast.error(error.message || 'Failed to enrich covers');
    }
  };
  
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
          {metrics.map((metric, index) => (
            <DashboardCard key={index} {...metric} />
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Admin AI Utilities</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={runMetadataEnrichment}
                className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Enrich Missing Metadata
              </button>
              <button
                type="button"
                onClick={runCoverEnrichment}
                className="px-4 py-2 text-sm rounded-lg border border-indigo-600 text-indigo-700 hover:bg-indigo-50"
              >
                Enrich Missing Covers
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Auto-fills missing descriptions/genre placeholders and resolves cover images.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Most Borrowed Books</h3>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading analytics...</p>
          ) : (
            <ul className="space-y-2">
              {popularBooks.map((book) => (
                <li key={book.bookId} className="text-sm text-gray-700">
                  {book.title} by {book.author} - {book.borrowCount} borrows
                </li>
              ))}
              {!popularBooks.length && <li className="text-sm text-gray-500">No loan history yet.</li>}
            </ul>
          )}
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