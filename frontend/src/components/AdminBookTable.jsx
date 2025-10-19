import React from 'react';
import { Search, Edit3, Trash2, Plus } from 'lucide-react';

const mockAdminBooks = [
  { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", category: "Fiction", copies: 3, totalCopies: 5, status: 'available' },
  { title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Science Fiction", copies: 2, totalCopies: 4, status: 'available' },
  { title: "Harry Potter", author: "J.K. Rowling", isbn: "978-0-439-70818-8", category: "Fantasy", copies: 1, totalCopies: 8, status: 'borrowed' },
  { title: "Brave New World", author: "Aldous Huxley", isbn: "978-0-06-085052-4", category: "Science Fiction", copies: 1, totalCopies: 4, status: 'reserved' },
];

const StatusBadge = ({ status, copies }) => {
    let color;
    if (status === 'available' && copies > 0) {
        color = 'bg-green-100 text-green-700';
    } else if (status === 'borrowed') {
        color = 'bg-red-100 text-red-700';
    } else if (status === 'reserved') {
        color = 'bg-yellow-100 text-yellow-700';
    } else {
        color = 'bg-gray-100 text-gray-700';
    }
    
    return (
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
            {status.toUpperCase()}
        </span>
    );
};

const AdminBookTable = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Books Inventory</h3>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                    <Plus className="w-5 h-5 mr-1" /> Add Book
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Manage your library's book collection</p>

            {/* Filter Bar - Reusing logic from Catalog */}
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
                </select>
                <select className="py-2 px-4 border border-gray-300 rounded-lg w-full md:w-auto">
                    <option>All Status</option>
                </select>
            </div>

            <p className="text-sm text-gray-600 mb-4">Showing {mockAdminBooks.length} of {mockAdminBooks.length} books</p>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Author</th>
                            <th className="px-4 py-3">ISBN</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Copies</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockAdminBooks.map((book, index) => (
                            <tr key={index} className="hover:bg-gray-50 text-sm">
                                <td className="px-4 py-3 font-medium text-gray-800">{book.title}</td>
                                <td className="px-4 py-3 text-gray-600">{book.author}</td>
                                <td className="px-4 py-3 text-gray-600">{book.isbn}</td>
                                <td className="px-4 py-3 text-gray-600">{book.category}</td>
                                <td className="px-4 py-3 font-medium">{book.copies}/{book.totalCopies}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={book.status} copies={book.copies} />
                                </td>
                                <td className="px-4 py-3 flex space-x-2">
                                    <button className="text-blue-500 hover:text-blue-700 p-1 rounded-md transition">
                                        <Edit3 className="w-5 h-5" title="Edit" />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 p-1 rounded-md transition">
                                        <Trash2 className="w-5 h-5" title="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookTable;