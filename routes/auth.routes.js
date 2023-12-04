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
        console.log("looking for user with email", req.body.email)
        const user = await User.findOne({ email: req.body.email });

        // Check if the user exists
        if (!user) {
            console.log("user not found", req.body.email)
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log("found user", obfuscate(user.toObject()))

        // Compare the entered password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // If passwords match, generate a JWT token
        if (passwordMatch) {
            console.log("password matches, signing token")
            const token = jwt.sign(
                { userId: user.oid, ip: req.socket.remoteAddress },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            // Send the token in the response
            return res.json({ token });
        } else {
            console.log(`password entered for user ${user.email} doesn't match`)
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

module.exports = router;
