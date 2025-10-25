const Loan = require('../models/loanModel');
const express = require('express');

const protect = require('../middlewares/protect');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  const userId = req.user.id; // Get ID from JWT payload
  
  try {
      // 1. Fetch all loan records for the user
      const loans = await Loan.find({ user: userId })
          // Populate the book details (title, author, etc.) from the Book model
          .populate('book', 'title author coverImageUrl isbn')
          .sort({ borrowDate: -1 })
          .exec();

      // 2. Separate into Current (Active) and History
      const currentLoans = [];
      const historyLoans = [];
      let overdueBooks = 0;
      let totalFines = 0;

      const now = new Date();

      loans.forEach(loan => {
          // Check if the loan is currently active (not returned)
          const isActive = !loan.isReturned;
          
          // Calculate fine/overdue status
          let fineToday = loan.fineAmount || 0;
          const isOverdue = isActive && loan.dueDate < now;

          if (isOverdue) {
              overdueBooks++;
              // In a real system, you'd calculate the running daily fine here.
              // For simplicity, we just flag it.
          }
          totalFines += fineToday;
          
          // Format the output to match the LoanTable's expected structure
          const loanData = {
              loanId: loan._id, // Essential for the Return button
              bookId: loan.book._id,
              bookTitle: loan.book.title,
              bookAuthor: loan.book.author,
              borrowDate: loan.borrowDate.toLocaleDateString(),
              dueDate: loan.dueDate.toLocaleDateString(),
              fine: fineToday.toFixed(2),
              status: isOverdue ? 'OVERDUE' : 'Active',
          };

          if (isActive) {
              currentLoans.push(loanData);
          } else {
              loanData.returnDate = loan.returnDate.toLocaleDateString();
              historyLoans.push(loanData);
          }
      });

      // 3. Return the compiled data
      res.status(200).json({
          currentLoans,
          historyLoans,
          summary: {
              activeBorrows: currentLoans.length,
              overdueBooks,
              totalFines: totalFines.toFixed(2),
          }
      });

  } catch (error) {
      console.error('Error fetching user loans:', error);
      res.status(500).json({ error: 'Failed to fetch loan history.' });
  }
});

module.exports = router;