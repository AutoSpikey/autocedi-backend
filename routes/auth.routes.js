const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Emtech = require("../lib/emtech");
const { obfuscate } = require('../lib/security');
const { generateUniqueId } = require('../lib/generator');

router.post('/register', async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);

    let user;

    try {
        const oid = generateUniqueId();
        user = await User.create({...req.body, oid, walletId: "no wallet" })
        const walletResponse = await Emtech.createWallet(oid)
        user.walletId = walletResponse.id
        user.save()
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(obfuscate(user.toObject()));
});

router.post('/login', async (req, res) => {
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