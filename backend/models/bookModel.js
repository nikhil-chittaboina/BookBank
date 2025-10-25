const mongoose = require('mongoose');

// const BookSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     // publishedDate: { type: Date, required: true },
//     genre: { type: String },
//     description: { type: String },
//     role: { 
//         type: String, 
//         enum: ['member', 'admin'], 
//         default: 'member' 
//     },
//     status: { type: String, enum: ['available', 'checked out', 'reserved'], default: 'available' },
//     borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//     dueDate: { type: Date, default: null }
// },{ timestamps: true });


const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    // publishedDate: { type: Date }, // Optional to keep

    genre: { type: String },
    description: { type: String },
    isbn: { type: String, unique: true }, // Good practice for identifiers

    // --- ADDED FIELDS ---
    memberId:Number,
    coverImageUrl: { type: String },             // For Open Library image URL construction
    totalCopies: { type: Number, default: 1, min: 0 },
    availableCopies: { type: Number, default: 1, min: 0 }, // The count available for checkout
}, { timestamps: true });

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
