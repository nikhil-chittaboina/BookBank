const express=require('express');
const router=express.Router();
const Book=require('../models/bookModel');

const protect = require('../middlewares/protect');
const role = require('../middlewares/role'); 

// Apply authentication middleware to all book routes
router.use(protect);
// Create a new book
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
// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});
// Get a book by ID
router.get('/:id', async (req, res) => {
    try { 
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
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



router.post('/:id/borrow', async (req, res) => {
    const user=req.user;
     // Assume user info is available in req.user after authentication middleware
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        book.status = 'borrowed';
        book.borrower = user._id;

        user.borrowedBooks.push(book._id);
        await user.save();

        // Track who borrowed the book
        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully' });
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ error: 'Failed to borrow book' });
    }
});

router.post('/:id/return', async (req, res) => {
    const user=req.user;
     // Assume user info is available in req.user after authentication middleware
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (book.borrower.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'You did not borrow this book' });
        }
        book.status = 'available';
        book.borrower = null; 
        user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== book._id.toString());
        await user.save();
        await book.save();
        res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ error: 'Failed to return book' });
    }   
});

module.exports=router;
