import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';

const BOOKS_API_URL = 'http://localhost:5000/api/books';

const Catalog = () => {

    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    useEffect(() => {
        console.log('[CATALOG] Fetching books from API...');
        setIsLoading(true);
        const getBooks = async () => {
            try {
                const response = await fetch(BOOKS_API_URL, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Include cookies for authentication
                });
                
                if (!response.ok) {
                     throw new Error(`Failed to fetch books: Status ${response.status}`);
                }
                
                const data = await response.json();
                console.log(`[CATALOG] Received ${data.length} books.`);
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getBooks();
    }, [fetchTrigger]);


    const handleRefresh = () => { 
        setFetchTrigger((prev) => prev + 1);
    };
    
    // Mock skeleton data for loading screen
    const mockSkeletonBooks = Array(8).fill(0).map((_, index) => ({ key: index }));

    if (isLoading) {
        // Show the skeleton screen while loading
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-800">Book Catalog</h2>
                    <p className="text-gray-500 mt-1 mb-8">Loading books...</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {mockSkeletonBooks.map((book, index) => (
                            // Render BookCard without data to show skeleton effect
                            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-10 bg-indigo-200 rounded-lg w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                
                {/* Page Title */}
                <h2 className="text-3xl font-bold text-gray-800">Book Catalog</h2>
                <p className="text-gray-500 mt-1 mb-8">Browse our complete collection of books</p>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or ISBN..."
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <select className="py-2 px-4 border border-gray-300 rounded-lg w-full md:w-auto">
                        <option>All Categories</option>
                        <option>Fantasy</option>
                        <option>Fiction</option>
                        {/* ... other categories */}
                    </select>
                    <select className="py-2 px-4 border border-gray-300 rounded-lg w-full md:w-auto">
                        <option>All Status</option>
                        <option>Available</option>
                        <option>Checked Out</option>
                    </select>
                </div>

                {/* Book Count */}
                <p className="text-sm text-gray-600 mb-6">Showing {books.length} of {books.length} books</p>

                {/* Book Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {books.map((book) => (
                        // 🎯 FIX: Use the MongoDB _id as the React key
                        <BookCard key={book._id} book={book} /> 
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalog;