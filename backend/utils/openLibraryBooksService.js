// services/openLibraryService.js

const Book = require('../models/bookModel'); 
 



const OPEN_LIBRARY_API = 'https://openlibrary.org/subjects/science.json?limit=40';
const DEFAULT_GENRE = 'General'; 

// --- Image Utility Function ---
const getCoverUrl = (coverId) => {
    // Uses the Open Library Covers API format: /b/id/<ID>-M.jpg
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
};

// --- Inventory Utility Function ---
const generateRandomInventory = () => {
    const total = Math.floor(Math.random() * 10) + 1; // 1 to 10 copies
    const available = Math.floor(Math.random() * (total + 1)); // 0 to total copies
    return { totalCopies: total, availableCopies: available };
};


/**
 * Fetches, cleans, and bulk inserts book data into MongoDB.
 * Also includes logic to wipe existing data.
 */
async function populateDatabase() {
    try {
        // --- 1. WIPE OLD DATA (Ensure Book.deleteMany is imported/available) ---
        await Book.deleteMany({});
        console.log("Database cleaned. Starting population...");

        // --- 2. Fetch data ---
        const response = await fetch(OPEN_LIBRARY_API);
        if (!response.ok) {
             throw new Error(`Open Library API failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        const rawBooks = data.works; 

        if (!rawBooks || rawBooks.length === 0) return 0;

        // --- 3. Map and Filter ---
        const booksToInsert = rawBooks
            .map(item => {
                const authors = item.authors ? item.authors.map(a => a.name) : ['Unknown'];
                const genre = item.subject ? item.subject[0] : DEFAULT_GENRE;
                const { totalCopies, availableCopies } = generateRandomInventory();
                
                // 🎯 FIX: Use 'cover_i' which is the common field for the ID in the 'works' endpoint
                const coverId = item.cover_i; 
                
                // Open Library data often uses 'first_publish_year'
                const publishedYear = item.first_publish_year; 

                if (!item.title || authors.length === 0) return null;

                return {
                    title: item.title,
                    author: authors.join(', '),
                    description: `A book about ${item.title} (${genre} category).`,
                    genre: genre,
                    
                    // Add the constructed image URL
                    coverImageUrl: getCoverUrl(coverId), 
                    publishedYear: publishedYear,
                    
                    totalCopies: totalCopies,
                    availableCopies: availableCopies,
                };
            })
            .filter(book => book !== null); 

        // --- 4. Bulk Insertion ---
        const result = await Book.insertMany(booksToInsert, { ordered: false }); 

        return result.length; 

    } catch (error) {
        console.error('Error in openLibraryService:', error.message);
        return 0; 
    }
}

module.exports = { populateDatabase };

