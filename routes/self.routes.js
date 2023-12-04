const express = require('express');
const router = express.Router();
const emtech = require('../lib/emtech');

const User = require("../models/user.model");
const { obfuscate } = require('../lib/security');

router.get('/me', async (req, res) => {
    const userId = req.auth.userId;

    const user = await User.findOne({ oid: userId })

    const userData = obfuscate(user.toObject())

    return res.json(userData)
})

router.get('/wallet', async (req, res) => {
    const userId = req.auth.userId;
    const user = await User.findOne({ oid: userId })

    try {
        const wallet = await emtech.getWallet(user.walletId);

        const calculateBalance = balances => {
            if(!balances.length) return 0;
            const bal = balances.find(balance => balance.token.name === "BYDC-eCedi")
            return bal.amount / 10 ** bal.token.decimals
        }

        const walletData = {
            id: wallet.id,
            status: wallet.status,
            createdAt: wallet.createdAt,
            balance: calculateBalance(wallet.balances)
        }

        console.log(walletData)
        return res.status(200).send(walletData);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
});

module.exports = router;