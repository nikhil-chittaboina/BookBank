import React from 'react';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';

// Mock Data matching the Catalog screenshot
const mockBooks = [
  { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", availableCount: 3, totalCopies: 5, status: 'available', imageUrl: 'https://placehold.co/400x200/94A3B8/FFFFFF/Book1' },
  { title: "1984", author: "George Orwell", category: "Dystopian", availableCount: 5, totalCopies: 5, status: 'available', imageUrl: 'https://placehold.co/400x200/A0A0A0/FFFFFF/Book2' },
  { title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", availableCount: 3, totalCopies: 4, status: 'available', imageUrl: 'https://placehold.co/400x200/B2B2B2/FFFFFF/Book3' },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", category: "Fantasy", availableCount: 5, totalCopies: 6, status: 'available', imageUrl: 'https://placehold.co/400x200/6A6A6A/FFFFFF/Book4' },
  { title: "Animal Farm", author: "George Orwell", category: "Fiction", availableCount: 5, totalCopies: 5, status: 'available', imageUrl: 'https://placehold.co/400x200/C8C8C8/FFFFFF/Book5' },
  { title: "The Chronicles of Narnia", author: "C.S. Lewis", category: "Fantasy", availableCount: 3, totalCopies: 4, status: 'available', imageUrl: 'https://placehold.co/400x200/9D9D9D/FFFFFF/Book6' },
];

const Catalog = () => {
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
        <p className="text-sm text-gray-600 mb-6">Showing {mockBooks.length} of {mockBooks.length} books</p>

        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockBooks.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;