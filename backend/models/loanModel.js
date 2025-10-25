
const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    // User who initiated the transaction
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The specific book being borrowed
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    
    borrowDate: { 
        type: Date, 
        default: Date.now 
    },
    dueDate: { 
        type: Date, 
        required: true 
    }, 
    
    // Set upon return; if null, the book is currently checked out
    returnDate: { 
        type: Date, 
        default: null 
    },
    
    // Status flag for easy querying
    isReturned: { 
        type: Boolean, 
        default: false 
    },
    
    // Final fine calculated upon return
    fineAmount: { 
        type: Number, 
        default: 0.00 
    },
}, { timestamps: true });

const Loan = mongoose.model('Loan', LoanSchema);
module.exports = Loan;