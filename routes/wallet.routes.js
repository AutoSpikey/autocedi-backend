const express = require('express');
const Wallet = require('../models/wallet.model');
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const newWallet = await Wallet.create({ ...req.body, userId: req.auth.userId })
        return res.status(201).json(newWallet);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        
        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found' });
        }
        if (wallet.userId !== req.auth.userId) return res.status(403);

        return res.status(200).send(wallet);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found' });
        }
        if (wallet.userId !== req.auth.userId) return res.status(403);

        return res.status(200).send(wallet);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findByIdAndDelete(req.params.id);

        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found' });
        }
        if (wallet.userId !== req.auth.userId) return res.status(403);

        return res.status(200).send({ message: 'Wallet deleted successfully' });
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
});

module.exports = router;