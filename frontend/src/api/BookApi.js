// BookApi.js
const BASE_API_URL = 'http://localhost:5000/api/books'; 

const parseJsonOrThrow = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

/**
 * Fetches book details from the backend API.
 */
export const fetchBookData = async (bookId) => {
  const API_ENDPOINT = `${BASE_API_URL}/${bookId}`; 
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
    });
    
    const data = await parseJsonOrThrow(response);

  //   const safeSummary = {
  //     ...data.summary,
  //     // CRITICAL: Cast the string value to Number, defaulting to 0.00 if missing
  //     totalFines: Number(data.summary.totalFines) || 0.00, 
  // };

//   const currentLoans = data.currentLoans.map(loan => ({
//     ...loan,
//     // Ensure the fine is a number for arithmetic/display
//     fine: Number(loan.fine) || 0.00 
// }));

// return {
//   currentLoans,
//   historyLoans: processedHistoryLoans, // assuming history loans were processed too
//   summary: safeSummary,
// };

return data;
    
    // --- MOCK FALLBACK (REMOVED IN FINAL CODE, use your backend data) ---
    // If your backend isn't running, this will ensure the UI fails clearly.
    // If you need the mock, ensure the status/copies fields match the schema.
    
   
  } catch (error) {
    throw new Error('Network error or invalid data received. Check if server is running on port 5000.'); 
  }
};

export const fetchBooks = async ({ q = '', genre = 'all', status = 'all', page = 1, limit = 12 } = {}) => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (genre && genre !== 'all') params.set('genre', genre);
  if (status && status !== 'all') params.set('status', status);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const endpoint = `${BASE_API_URL}?${params.toString()}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return parseJsonOrThrow(response);
};

/**
 * Handles the API call to process the book borrow action.
 */
export const borrowBookApiCall = async (bookId, dueDate) => { 
  // Backend path is /api/books/:id/borrow
  const API_ENDPOINT = `${BASE_API_URL}/${bookId}/borrow`; 
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Authorization token should be included here if needed
      },
      credentials: 'include',
      body: JSON.stringify({ 
        bookId: bookId, 
        dueDate: dueDate // ⬅️ NEW: Required by the backend Loan transaction
      }),
    });

    return await parseJsonOrThrow(response); 
  } catch (error) {
    throw new Error(error.message || 'Failed to complete borrow transaction.'); 
  }
};

export const fetchBookRecommendations = async () => {
  const endpoint = `${BASE_API_URL}/recommendations`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return parseJsonOrThrow(response);
};

export const generateBookAiReview = async (bookId, regenerate = false) => {
  const endpoint = `${BASE_API_URL}/${bookId}/ai-review${regenerate ? '?regenerate=true' : ''}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return parseJsonOrThrow(response);
};