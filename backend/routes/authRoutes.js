const express=require('express');
;
const router=express.Router();
const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');


// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully',newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
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
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in user' });
    }
});

router.post('/logout', (req, res) => {

    console.log("Logging out user");
    console.log(req.user)
    res.clearCookie('token');
    
    res.status(200).json({ message: 'User logged out successfully'});
});



module.exports = router;
