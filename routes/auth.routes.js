const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/', async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await User.create(req.body);
        const userData = obfuscate(user.toObject())
        return res.status(201).json(userData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

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
                { userId: user._id, ip: req.socket.remoteAddress },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '5m' } // Token expires in 5 minutes
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