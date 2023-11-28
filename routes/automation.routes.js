const express = require('express');
const router = express.Router();
const Automation = require('../models/automation.model');

// Create
router.post('/', async (req, res) => {
    try {
        const automation = await Automation.create(req.body);
        res.json(automation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const automations = await Automation.find();
        res.json(automations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const automation = await Automation.findById(req.params.id);

        if(!automation) return res.status(404).json({ message: `automation with id ${id} not found` });
        
        return res.json(automation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const automation = await Automation.findByIdAndDelete(req.params.id);
        res.json(automation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
