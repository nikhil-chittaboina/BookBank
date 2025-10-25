const express=require('express');
;
const router=express.Router();
const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');





        const generateMemberId = () => {
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `BB-${timestamp}-${random}`;
        };

// Register
router.post('/register', async (req, res) => {

    console.log("Registering user with data:", req.body);
    const { name, email, password } = req.body;
    try {
        const memberId = generateMemberId();

       
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            memberId: memberId, // Pass the required memberId
            // activeBorrowsCount and totalFines will use their schema defaults (0)
        });
    
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully',newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login
/* This `router.post('/login', async (req, res) => { ... }` function is handling the login process for
users. Here's a breakdown of what it does: */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with data:", req.body);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'User logged in successfully', user,token});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in user' });
    }
});

router.post("/validate-token",async (req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({error:'No token provided'});
    }
    const decoded=jwt.verify(token,'your_jwt_secret'); // we might not recieve all the details of the user from jwt you generaly put id and role so you fetch details anyway
    const user  =await User.findById(decoded.id).select('-password'); 
    if(!user){
        return res.status(401).json({error:'Invalid token'});
    }
    res.status(200).json({ message: 'Token is valid', user });
})

router.post('/logout', (req, res) => {

    console.log("Logging out user");
    console.log(req.user)
    res.clearCookie('token');
    
    res.status(200).json({ message: 'User logged out successfully'});
});



module.exports = router;
