const express = require('express');
const router = express.Router();

const User = require('../models/user.model');

router.get('/:phone', async (req, res) => {
    try {
        const phone = req.params.phone;
        const user = await User.findOne({phone}).exec();
        console.log(user);
        return user ? res.json(user) : res.status(404).json({message: `no user with phone number ${phone} found`});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;