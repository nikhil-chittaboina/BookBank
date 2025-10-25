// src/api/userApi.js

const BASE_API_URL = 'http://localhost:5000/api'; 

/**
 * Fetches the user's active and historical loan data, along with the summary.
 */
export const fetchUserLoans = async () => {
    const API_ENDPOINT = `${BASE_API_URL}/loans`;
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Needed to send the JWT cookie
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to retrieve loan data.' }));
            throw new Error(errorData.message || `Error fetching loans (Status: ${response.status})`);
        }
        
        return response.json();
    } catch (error) {
        // This usually catches network/CORS issues
        throw new Error(`Network error accessing loan service: ${error.message}`);
    }
};

/**
 * Posts a request to mark a book as returned.
 */
export const returnBookApiCall = async (bookId) => {
    // Note: We use the bookId in the path, matching the backend route setup.
    const API_ENDPOINT = `http://localhost:5000/api/books/${bookId}/return`;
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ bookId }), // Although in the path, safe to include in body
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown return error.' }));
            throw new Error(errorData.message || `Return failed with status: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        throw new Error(`Failed to process return request: ${error.message}`);
    }
};