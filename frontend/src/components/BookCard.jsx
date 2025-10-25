import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fallback image path (Ensure this path exists in your public folder)
const DEFAULT_IMAGE_PATH = "/images/banner2.jpeg"; 

const BookCard = ({ book }) => {

    // --- 1. Data Validation and Extraction (From MongoDB Document) ---
    if (!book) {
        return null;
    }
    
    // Safely destructure properties expected from the final MongoDB document
    const { 
        title, 
        author, 
        genre, 
        _id, // ⬅️ CRITICAL: Using the Mongoose standard primary key
        availableCopies = 0, 
        totalCopies = 0,     
        coverImageUrl      
    } = book;

    // Safely process the Author field (assuming it's a single string)
    const authorString = author || 'Unknown Author';

    // Status based on the calculated available count
    const status = availableCopies > 0 ? 'Available' : 'Unavailable';
    
    // --- Determine Colors ---
    const badgeClass = status === 'Available' 
        ? 'bg-green-600 text-white' 
        : 'bg-red-600 text-white';
    
    const detailsColor = availableCopies > 0 ? 'text-indigo-600' : 'text-red-600';

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* Image Container with Status Badge */}
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                <img 
                    // Use coverImageUrl from MongoDB, falling back to local file
                    src={coverImageUrl || DEFAULT_IMAGE_PATH} 
                    alt={title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE_PATH; }}
                />
                <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full uppercase ${badgeClass}`}>
                    {status}
                </span>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
                <p className="text-sm text-gray-500 mb-3">by **{authorString}**</p>

                <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Category:</span>
                    <span className="font-medium text-gray-800">{genre || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>Available:</span>
                    <span className={`font-bold ${detailsColor}`}>
                        {availableCopies}/{totalCopies}
                    </span>
                </div>

                {/* 🎯 LINK: Uses the MongoDB _id for correct navigation */}
                <Link 
                    to={`/book/${_id}`} 
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                    <BookOpen className="w-4 h-4 mr-2" /> View Details
                </Link>
            </div>
        </div>
    );
};

export default BookCard;