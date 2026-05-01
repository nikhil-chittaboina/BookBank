import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';
import { fetchBooks } from '../api/BookApi';

const Catalog = () => {

    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('all');
    const [status, setStatus] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0, limit: 12 });
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const getBooks = async () => {
            try {
                const data = await fetchBooks({
                    q: search,
                    genre,
                    status,
                    page: pagination.page,
                    limit: pagination.limit
                });
                setBooks(data.books || []);
                setPagination(data.pagination || pagination);
                setGenres(data.filters?.genres || []);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getBooks();
    }, [search, genre, status, pagination.page, pagination.limit]);
    
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
                            value={search}
                            onChange={(event) => {
                                setPagination((prev) => ({ ...prev, page: 1 }));
                                setSearch(event.target.value);
                            }}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <select
                        value={genre}
                        onChange={(event) => {
                            setPagination((prev) => ({ ...prev, page: 1 }));
                            setGenre(event.target.value);
                        }}
                        className="py-2 px-4 border border-gray-300 rounded-lg w-full md:w-auto"
                    >
                        <option value="all">All Categories</option>
                        {genres.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(event) => {
                            setPagination((prev) => ({ ...prev, page: 1 }));
                            setStatus(event.target.value);
                        }}
                        className="py-2 px-4 border border-gray-300 rounded-lg w-full md:w-auto"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="checked_out">Checked Out</option>
                    </select>
                </div>

                {/* Book Count */}
                <p className="text-sm text-gray-600 mb-6">Showing {books.length} of {pagination.totalCount} books</p>

                {/* Book Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {books.map((book) => (
                        // 🎯 FIX: Use the MongoDB _id as the React key
                        <BookCard key={book._id} book={book} /> 
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <p className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</p>
                    <button
                        type="button"
                        onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Catalog;