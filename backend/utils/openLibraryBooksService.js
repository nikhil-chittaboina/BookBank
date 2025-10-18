// services/openLibraryService.js

const Book = require('../models/bookModel'); 
 
const OPEN_LIBRARY_API = 'https://openlibrary.org/subjects/science.json?limit=40';
const DEFAULT_GENRE = 'General'; 

/**
 * Fetches a list of books from Open Library API and bulk inserts them into MongoDB.
 * @returns {number} The count of books successfully inserted.
 */
async function populateDatabase() {
    try {
        // 1. Fetch data from Open Library (using a simple subject search)
        const response = await fetch(OPEN_LIBRARY_API);
        if (!response.ok) {
            throw new Error(`Open Library API failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        // Open Library list results are often in the 'works' array
        const rawBooks = data.works; 

        if (!rawBooks || rawBooks.length === 0) {
            return 0;
        }

        // 2. Map and Filter the raw data to match your Mongoose Schema
        const booksToInsert = rawBooks
            .map(item => {
                // Open Library data is less nested than Google Books
                const authors = item.authors ? item.authors.map(a => a.name) : ['Unknown'];
                const genre = item.subject ? item.subject[0] : DEFAULT_GENRE;

                // Basic Validation: Only check for the absolute required fields (Title, Author)
                if (!item.title || authors.length === 0) return null;

                return {
                    title: item.title,
                    author: authors.join(', '),
                    // Open Library list endpoints rarely have full descriptions, so we use a placeholder/default
                    description: `A book about ${item.title} (${genre} category).`,
                    // Mapped to your Schema:
                    genre: genre,
                    // status, borrower, and dueDate use schema defaults
                };
            })
            .filter(book => book !== null); 

        if (booksToInsert.length === 0) {
             console.log('Fetched data, but all books failed internal validation.');
             return 0;
        }

        // 3. Use insertMany() for efficient bulk insertion
        const result = await Book.insertMany(booksToInsert, { ordered: false }); 

        return result.length; 

    } catch (error) {
        console.error('Error in openLibraryService:', error.message);
        throw error;
    }
}

module.exports = { populateDatabase };