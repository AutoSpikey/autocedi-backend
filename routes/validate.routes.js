const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const { obfuscate } = require('../lib/security');

router.get('/:phone', async (req, res) => {
    try {
        const phone = req.params.phone;
        const user = await User.findOne({ phone });
        if (user) {
            return res.json(obfuscate(user.toObject()))
        } else {
            return res.status(404).json({ message: `no user with phone number ${phone} found` });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;