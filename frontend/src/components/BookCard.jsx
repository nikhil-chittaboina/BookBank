import React from 'react';
import { BookOpen } from 'lucide-react';

const BookCard = ({ book }) => {
  const { title, author, category, availableCount, totalCopies, imageUrl, status } = book;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Image Container with Status Badge */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src = "placeholder.jpg" }} // Fallback
        />
        <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
          status === 'available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">by {author}</p>

        <div className="flex justify-between text-xs text-gray-600 mb-4">
          <span>Category:</span>
          <span className="font-medium text-gray-800">{category}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Available:</span>
          <span className="font-bold text-indigo-600">{availableCount}/{totalCopies}</span>
        </div>

        <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
          <BookOpen className="w-4 h-4 mr-2" /> View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;