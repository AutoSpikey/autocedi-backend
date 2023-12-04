const express = require('express');
const router = express.Router();

const User = require("../models/user.model");
const { obfuscate } = require('../lib/security');

router.get('/me', async (req, res) => {
    const userId = req.auth.userId;

    const user = await User.findOne({ oid: userId })

    const userData = obfuscate(user.toObject())

    return res.json(userData)
})

module.exports = router;