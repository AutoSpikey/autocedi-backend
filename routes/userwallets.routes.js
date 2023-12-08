const express = require('express');
const router = express.Router();

const User = require("../models/user.model");

router.get('/', async (req, res) => {
    const users = await User.find()

    let data = []
    for(let user of users) {
        data.push({
            name: `${user.firstName} ${user.lastName}`,
            wallet: user.walletId
        })
    }

    return res.json(data)
})

module.exports = router;
