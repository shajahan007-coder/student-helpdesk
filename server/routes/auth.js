const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// CRITICAL: Must use the same secret as your middleware
const JWT_SECRET = process.env.JWT_SECRET; 

// --- /auth/register ---
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, password: hashedPassword, role: role || 'student' });
        await user.save();

        // Payload matches req.user = decoded.user in your middleware
        const payload = { 
            user: { 
                id: user._id, // Use _id for MongoDB consistency
                role: user.role 
            } 
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: { id: user._id, email: user.email, role: user.role } 
            });
        });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send('Server error');
    }
});

// --- /auth/login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { 
            user: { 
                id: user._id, 
                role: user.role 
            } 
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: { id: user._id, email: user.email, role: user.role } 
            });
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;