import React, { useEffect,useState } from 'react';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';
import { use } from 'react';



const BOOKS_API_URL = 'http://localhost:5000/api/books';

// Mock Data matching the Catalog screenshot


// const mockBooks = [
//   { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", availableCount: 3, totalCopies: 5, status: 'available', imageUrl: 'https://placehold.co/400x200/94A3B8/FFFFFF/Book1' },
//   { title: "1984", author: "George Orwell", category: "Dystopian", availableCount: 5, totalCopies: 5, status: 'available', imageUrl: 'https://placehold.co/400x200/A0A0A0/FFFFFF/Book2' },
//   { title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", availableCount: 3, totalCopies: 4, status: 'available', imageUrl: 'https://placehold.co/400x200/B2B2B2/FFFFFF/Book3' },
//   { title: "The Lord of the Rings", author: "J.R.R. Tolkien", category: "Fantasy", availableCount: 5, totalCopies: 6, status: 'available', imageUrl: 'https://placehold.co/400x200/6A6A6A/FFFFFF/Book4' },
//   { title: "Animal Farm", author: "George Orwell", category: "Fiction", availableCount: 5, totalCopies: 5, status: 'available', imageUrl: 'https://placehold.co/400x200/C8C8C8/FFFFFF/Book5' },
//   { title: "The Chronicles of Narnia", author: "C.S. Lewis", category: "Fantasy", availableCount: 3, totalCopies: 4, status: 'available', imageUrl: 'https://placehold.co/400x200/9D9D9D/FFFFFF/Book6' },
// ];

const Catalog = () => {

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    console.log('Fetching books from API...');
    setIsLoading(true);
    const getBooks = async () => {
      try {
        const response = await fetch(BOOKS_API_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include cookies for authentication
        });
        const data = await response.json();
        console.log(data);
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBooks();
  }, [fetchTrigger]);


 


  const handleRefresh = () => {  // Function to trigger re-fetching books in case of borrow and return actions  
    setFetchTrigger((prev) => prev + 1);
  };
 



  // const mockBooks = Array.from({ length: 20 }, (_, index) => ({
  //   title: `Book Title ${index + 1}`,
  //   author: `Author ${index + 1}`,
  //   category: `Category ${index + 1}`,
  //   availableCount: Math.floor(Math.random() * 5) + 1,
  //   totalCopies: Math.floor(Math.random() * 10) + 1,
  //   status: Math.random() > 0.5 ? 'available' : 'checked out', 

  
 
  // const mockBooks = Array.from({ length: 20 }, (_, index) => ({
  //   title: `Book Title ${index + 1}`,
  //   author: `Author ${index + 1}`,
  //   category: `Category ${index + 1}`,
  //   availableCount: Math.floor(Math.random() * 5) + 1,
  //   totalCopies: Math.floor(Math.random() * 10) + 1,
  //   status: Math.random() > 0.5 ? 'available' : 'checked out',
  //   imageUrl: `https://placehold.co/400x200/${Math.floor(Math.random() * 16777215).toString(16)}/FFFFFF/Book${index + 1}`
  // }));
  if (isLoading) {
    // Show the skeleton screen while loading
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800">Book Catalog</h2>
            <p className="text-gray-500 mt-1 mb-8">Loading books...</p>
            
            {/* Book Cards Grid with Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Render 8 skeleton cards */}
                {Array(8).fill(0).map((_, index) => (
                    <BookCard key={index} />
                ))}
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
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;