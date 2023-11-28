const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user.model")

// Create
router.post('/', async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;