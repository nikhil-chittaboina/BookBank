const express = require('express');
const rateLimit = require('express-rate-limit');
const { param, query, body } = require('express-validator');
const mongoose = require('mongoose');

const router = express.Router();
const Book = require('../models/bookModel');
const Loan = require('../models/loanModel');
const User = require('../models/userModel');
const protect = require('../middlewares/protect');
const role = require('../middlewares/role');
const validate = require('../middlewares/validate');
const { populateDatabase } = require('../utils/openLibraryBooksService');
const { buildSourceHash, generateAiReview } = require('../utils/llmReviewService');

router.use(protect);

// --- TRANSACTION RETRY UTILITY FUNCTION (UPDATED LOGGING) ---
const withTransaction = async (fn, maxRetries = 3) => {
    let retries = 0;
    while (retries < maxRetries) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const result = await fn(session);
            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            // --- NEW: Log the error on the server side for diagnostics ---
            if (retries === 0) {
                 console.error('--- INTERNAL TRANSACTION CRASH LOG ---');
                 console.error(error); 
                 console.error('------------------------------------------');
            }
            // --- End Logging ---

            const isTransientError = error.errorLabelSet && error.errorLabelSet.has('TransientTransactionError');
            const isNetworkReset = error.code === 'ECONNRESET' || error.name === 'MongoNetworkError';
            
            if (isTransientError || isNetworkReset) {
                console.warn(`Transient error encountered. Retrying transaction (Attempt ${retries + 1}/${maxRetries})...`);
                retries++;
                await new Promise(resolve => setTimeout(resolve, 500 * retries));
                continue;
            }
            throw error;
        } finally {
            session.endSession();
        }
    }
    throw new Error('Transaction failed after maximum retries due to persistent transient errors.');
};

const aiReviewLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many AI review requests. Please try again in a minute.' }
});

router.post('/', role('admin'), async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Failed to create book' });
    }
});

router.get('/',
    query('q').optional().isString().isLength({ max: 100 }),
    query('genre').optional().isString().isLength({ max: 80 }),
    query('status').optional().isIn(['all', 'available', 'checked_out']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    validate,
    async (req, res) => {
    try {
        const { q = '', genre = '', status = 'all' } = req.query;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 12);
        const skip = (page - 1) * limit;

        const criteria = {};

        if (q.trim()) {
            criteria.$or = [
                { title: { $regex: q.trim(), $options: 'i' } },
                { author: { $regex: q.trim(), $options: 'i' } },
                { isbn: { $regex: q.trim(), $options: 'i' } }
            ];
        }

        if (genre && genre !== 'all') {
            criteria.genre = genre;
        }

        if (status === 'available') {
            criteria.availableCopies = { $gt: 0 };
        } else if (status === 'checked_out') {
            criteria.availableCopies = { $lte: 0 };
        }

        const [books, totalCount, genres] = await Promise.all([
            Book.find(criteria).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Book.countDocuments(criteria),
            Book.distinct('genre')
        ]);

        res.status(200).json({
            books,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.max(1, Math.ceil(totalCount / limit))
            },
            filters: {
                genres: genres.filter(Boolean).sort()
            }
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

router.get('/recommendations', async (req, res) => {
    try {
        const userId = req.user.id;
        const previousLoans = await Loan.find({ user: userId })
            .populate('book', 'genre _id')
            .sort({ createdAt: -1 })
            .limit(30);

        const genreScores = previousLoans.reduce((acc, item) => {
            if (item.book?.genre) {
                acc[item.book.genre] = (acc[item.book.genre] || 0) + 1;
            }
            return acc;
        }, {});

        const topGenres = Object.entries(genreScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre]) => genre);

        const borrowedBookIds = previousLoans
            .map((item) => item.book?._id)
            .filter(Boolean);

        const recommendations = await Book.find({
            _id: { $nin: borrowedBookIds },
            ...(topGenres.length ? { genre: { $in: topGenres } } : {})
        })
            .sort({ availableCopies: -1, createdAt: -1 })
            .limit(8);

        res.status(200).json({
            recommendations,
            strategy: topGenres.length
                ? `history-based:${topGenres.join(',')}`
                : 'fallback:latest'
        });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Get a book by ID
router.get('/:id',
    param('id').isMongoId(),
    validate,
    async (req, res) => {
    const bookId = req.params.id;

    try { 
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        // Constructs the necessary status field for the frontend UI
        res.status(200).json({
            ...book.toObject(),
            status: book.availableCopies > 0 ? 'AVAILABLE' : 'CHECKED OUT' 
        });

    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

// Update a book by ID
router.put('/:id', role('admin'), async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Delete a book by ID
router.delete('/:id', role('admin'), async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(204).json();
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

const generateMemberId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TEMP-BB-${timestamp}-${random}`;
};

// --- NEW: Borrow Route (Final Integrated Logic) ---

router.post('/:id/borrow',
    param('id').isMongoId(),
    body('dueDate').isISO8601(),
    validate,
    async (req, res) => {
    const user = req.user;
    const bookId = req.params.id; 
    const { dueDate } = req.body;

    try {
        const result = await withTransaction(async (session) => {
            const book = await Book.findById(bookId).session(session);
            const member = await User.findById(user.id).session(session); 
            
            if (!book) throw { status: 404, message: 'Book not found.' };

            // CRITICAL FIX 1: Check for Null Member/User Document
            if (!member) {
                throw { status: 404, message: 'User profile linked to session not found.' }; 
            }

            // --- SAFELY HANDLE OLD SCHEMA USER UPDATES ---
            // 1. Fix: Auto-assign memberId if missing (PREVENTS VALIDATION CRASH ON SAVE)
            if (!member.memberId) {
                console.warn(`Old user found: Assigning temporary memberId for validation.`);
                member.memberId = generateMemberId();
            }
            
            // 2. Check Inventory and Limits
            if (book.availableCopies <= 0) throw { status: 409, message: 'All copies are currently borrowed.' };
            
            // Safely read the current borrow count (safeguards against undefined/null)
            const currentBorrows = member.activeBorrowsCount || 0; 
            
            if (currentBorrows >= 5) { 
                 throw { status: 403, message: 'Borrowing limit reached (5 books).' };
            }
            
            // --- TRANSACTION EXECUTION ---
            const newLoan = new Loan({ user: user.id, book: bookId, dueDate: new Date(dueDate) });

            book.availableCopies -= 1;
            member.activeBorrowsCount = currentBorrows + 1; // Update using the safe currentBorrows variable

            await newLoan.save({ session });
            await book.save({ session });
            await member.save({ session });

            return { message: 'Book borrowed successfully', loanId: newLoan._id };
        });

        res.status(200).json(result);

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        // Logs the internal error and returns 500
        console.error('Final UNHANDLED failure processing borrow transaction:', error); 
        res.status(500).json({ error: 'Failed to process borrow request due to internal server failure.' });
    }
});

// --- NEW: Return Route with Transaction and Retry Logic (Finalized Safety) ---

router.post('/:id/return',
    param('id').isMongoId(),
    validate,
    async (req, res) => {
    const user = req.user;
    const bookId = req.params.id;

    try {
        const result = await withTransaction(async (session) => {
            
            // 1. Find and update the active loan
            const activeLoan = await Loan.findOneAndUpdate(
                { user: user.id, book: bookId, isReturned: false },
                { $set: { returnDate: new Date(), isReturned: true } },
                { new: true, session }
            );

            if (!activeLoan) throw { status: 404, message: 'No active loan found for this book and user.' };

            const book = await Book.findById(bookId).session(session);
            const member = await User.findById(user.id).session(session);

            if (!member) throw { status: 404, message: 'User profile linked to session not found.' }; 
            
            // 2. Fine Calculation (Safely access returnDate/dueDate)
            let fine = 0;
            if (activeLoan.returnDate > activeLoan.dueDate) {
                const lateDays = Math.ceil((activeLoan.returnDate - activeLoan.dueDate) / (1000 * 60 * 60 * 24));
                fine = lateDays * 0.50;
            }
            activeLoan.fineAmount = fine;
            await activeLoan.save({ session });

            // 3. Update Inventory Count & User Count (Safely)
            book.availableCopies += 1;
            
            member.activeBorrowsCount = (member.activeBorrowsCount || 0) - 1; 
            member.totalFines = (member.totalFines || 0) + fine; 
            
            // Fix: Auto-assign memberId if missing (for return route safety)
            if (!member.memberId) {
                 member.memberId = generateMemberId();
            }

            await book.save({ session });
            await member.save({ session });

            return { message: 'Book returned successfully', fine: fine };
        });
        
        res.status(200).json(result);
        
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Final UNHANDLED failure processing return transaction:', error);
        res.status(500).json({ error: 'Failed to process return request due to internal server failure.' });
    }
});

router.post('/:id/ai-review',
    aiReviewLimiter,
    param('id').isMongoId(),
    query('regenerate').optional().isBoolean().toBoolean(),
    validate,
    async (req, res) => {
        const regenerate = req.query.regenerate === true;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const sourceHash = buildSourceHash(book);
        const cacheIsValid = book.aiReview?.generatedAt
            && book.aiReview.sourceHash === sourceHash;

        if (cacheIsValid && !regenerate) {
            return res.status(200).json({
                review: book.aiReview,
                cached: true
            });
        }

        const review = await generateAiReview(book);
        book.aiReview = review;
        await book.save();

        return res.status(200).json({
            review: book.aiReview,
            cached: false
        });
    }
);


// --- NEW ROUTE: Populate Database ---
router.post('/populate', role('admin'), async (req, res) => {
    try {
        const count = await populateDatabase();
        res.status(200).json({ 
            message: `Database successfully wiped and populated with ${count} new book records.`,
            count: count
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to populate database.' });
    }
});
module.exports=router;