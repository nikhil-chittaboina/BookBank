const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['user', 'admin'], default: 'user' },
//    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]

// },{ timestamps: true });



const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

   
    role: { type: String, enum: ['member', 'admin'], default: 'member' },
    memberId: { type: String, required: true }, // Displayed on profile
    totalFines: { type: Number, default: 0.00 },
    activeBorrowsCount: { type: Number, default: 0 }, // For checking borrowing limit quickly
    
    // createdAt (from timestamps) will be used for 'Member Since'
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

module.exports = User;


