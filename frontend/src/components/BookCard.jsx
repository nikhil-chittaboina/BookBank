// import React from 'react';
// import { BookOpen } from 'lucide-react';

// const BookCard = ({ book }) => {

//   if(book==null){
//     return <div>Loading...</div>;
//   }
//   const { title, author, genre,  status } = book;
//   const totalCopies = 8;
//   const availableCount =5;

//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
//       {/* Image Container with Status Badge */}
//       <div className="relative h-48 bg-gray-200 flex items-center justify-center">
//         {/* <img 
//           src={imageUrl} 
//           alt={title} 
//           className="w-full h-full object-cover" 
//           onError={(e) => { e.target.onerror = null; e.target.src = "placeholder.jpg" }} // Fallback
//         /> */}
//         <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
//           status === 'available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
//         }`}>
//           {status}
//         </span>
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
//         <p className="text-sm text-gray-500 mb-3">by {author}</p>

//         <div className="flex justify-between text-xs text-gray-600 mb-4">
//           <span>Category:</span>
//           <span className="font-medium text-gray-800">{genre}</span>
//         </div>
        
//         <div className="flex justify-between text-sm text-gray-600 mb-4">
          
//           <span>Available:</span>
//           <span className="font-bold text-indigo-600">{availableCount}/{totalCopies}</span>
//         </div>

//         <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
//           <BookOpen className="w-4 h-4 mr-2" /> View Details
//         </button>

//       </div>
//     </div>
//   );
// };

// export default BookCard;

import React from 'react';
import { BookOpen } from 'lucide-react';

const BookCard = ({ book }) => {

  // --- 1. Data Validation and Extraction (Open Library) ---
  if (!book) {
    // Return null instead of "Loading..." if the parent component is mapping
    // over a partially loaded/filtered array, which is safer.
    return null; 
  }
  
  // Destructure fields available from the Open Library Subject API 'works' array:
  const { 
    title, 
    authors, // Open Library gives an array of author objects
    cover_i, // The ID needed to generate the cover image URL
  } = book;
  
  // Safely extract the primary author's name
  const authorName = authors && authors.length > 0 
    ? authors[0].name 
    : 'Unknown Author';

  // Construct the Image URL using the Covers API base and cover_i
  // Using 'M' for Medium size
  const imageUrl = cover_i 
    ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` 
    : 'https://via.placeholder.com/192x300.png?text=No+Cover'; // Placeholder image

  // --- 2. Mock Data / Custom Fields (As they are not in the Open Library Subject API) ---
  const genre = book.subject && book.subject.length > 0 ? book.subject[0] : 'Science';
  const totalCopies = 8;
  const availableCount = 5;
  const status = availableCount > 0 ? 'Available' : 'Unavailable';
  // --------------------------------------------------------------------------

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Image Container with Status Badge */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src = "/images/banner2.jpeg" }} // Image Fallback
        />
        <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
          status === 'Available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Using authorName here */}
        <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">by **{authorName}**</p>

        {/* Using the first subject as genre/category */}
        <div className="flex justify-between text-xs text-gray-600 mb-4">
          <span>Category:</span>
          <span className="font-medium text-gray-800">{genre}</span>
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