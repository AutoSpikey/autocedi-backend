const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // If passwords match, generate a JWT token
        if (passwordMatch) {
            const token = jwt.sign(
                { userId: user._id, email: user.email, wallet: user.wallet },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '15m' } // Token expires in 15 minutes
            );

            // Send the token in the response
            res.json({ token });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    return res.json({
        "message": "not implemented yet"
    }, 200)
});

module.exports = router;