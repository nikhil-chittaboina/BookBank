const express = require('express');
const router = express.Router();


const protect = require('../middlewares/protect'); 
const role = require('../middlewares/role'); 
const { populateDatabase } = require('../utils/openLibraryBooksService'); 
const { resolveCoverForBook } = require('../utils/coverResolverService');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const Loan = require('../models/loanModel');


// Apply authentication (protect) and admin authorization (role('admin')) 
// to all system administration endpoints
router.use(protect, role('admin'));

// POST /populate-db (Full URL will be /api/admin/populate-db)
router.post('/populate-db', async (req, res) => {
   
    try {
        const insertedCount = await populateDatabase();
        console.log(req.user);
        res.status(201).json({ 
            message: `Database successfully populated with ${insertedCount} books.`,
            insertedCount 
        });
    } catch (error) {
        // Return 500 status if the population service throws an error
        res.status(500).json({ error: 'Database population failed.', details: error.message });
    }
});

router.post('/enrich-books', async (req, res) => {
    try {
        const books = await Book.find({
            $or: [
                { description: { $exists: false } },
                { description: '' },
                { genre: { $exists: false } },
                { genre: '' }
            ]
        }).limit(100);

        let updatedCount = 0;
        for (const book of books) {
            if (!book.description) {
                book.description = `A curated library title: ${book.title} by ${book.author}.`;
            }
            if (!book.genre) {
                book.genre = 'General';
            }
            await book.save();
            updatedCount += 1;
        }

        res.status(200).json({
            message: `Metadata enrichment completed for ${updatedCount} books.`,
            updatedCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Book enrichment failed.', details: error.message });
    }
});

router.post('/enrich-covers', async (req, res) => {
    try {
        const books = await Book.find({
            $or: [
                { coverImageUrl: { $exists: false } },
                { coverImageUrl: null },
                { coverImageUrl: '' }
            ]
        }).limit(300);

        let updatedCount = 0;
        let unresolvedCount = 0;

        for (const book of books) {
            const resolvedCover = await resolveCoverForBook(book);
            if (!resolvedCover) {
                unresolvedCount += 1;
                continue;
            }
            book.coverImageUrl = resolvedCover;
            await book.save();
            updatedCount += 1;
        }

        res.status(200).json({
            message: `Cover enrichment completed. Updated ${updatedCount} books.`,
            updatedCount,
            unresolvedCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Cover enrichment failed.', details: error.message });
    }
});

router.get('/analytics', async (req, res) => {
    try {
        const [totalBooks, borrowedBooks, activeUsers, finesAgg, popularBooks] = await Promise.all([
            Book.countDocuments(),
            Loan.countDocuments({ isReturned: false }),
            User.countDocuments({ role: 'member' }),
            User.aggregate([{ $group: { _id: null, total: { $sum: '$totalFines' } } }]),
            Loan.aggregate([
                { $group: { _id: '$book', borrowCount: { $sum: 1 } } },
                { $sort: { borrowCount: -1 } },
                { $limit: 5 }
            ])
        ]);

        const populatedPopularBooks = await Book.populate(popularBooks, {
            path: '_id',
            select: 'title author'
        });

        res.status(200).json({
            metrics: {
                totalBooks,
                borrowedBooks,
                activeUsers,
                totalFines: Number(finesAgg?.[0]?.total || 0).toFixed(2)
            },
            popularBooks: populatedPopularBooks.map((item) => ({
                bookId: item._id?._id,
                title: item._id?.title || 'Unknown',
                author: item._id?.author || 'Unknown',
                borrowCount: item.borrowCount
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
    }
});



module.exports = router;