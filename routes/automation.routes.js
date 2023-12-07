const express = require('express');
const router = express.Router();
const Automation = require('../models/automation.model');
const { generateUniqueId } = require('../lib/generator');

// Create
router.post('/', async (req, res) => {
    try {
        const newAutomation = { ...req.body, userId: req.auth.userId, oid: generateUniqueId() }
        console.log(JSON.stringify(newAutomation, null, 2));
        const automation = await Automation.create(newAutomation);
        return res.json(automation);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "failed to create automation" });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const automations = await Automation.find({ userId: req.auth.userId });
        return res.json(automations);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const automation = await Automation.findOne({ oid: req.params.id });

        if (!automation) return res.status(404).json({ message: `automation with oid ${oid} not found` });
        if (automation.userId !== req.auth.userId) return res.status(403);

        return res.json(automation);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const automation = await Automation.findOneAndDelete({ oid: req.params.id });

        if (!automation) {
            return res.status(404).send({ message: 'Automation not found' });
        }
        if (automation.userId !== req.auth.userId) return res.status(403);

        return res.status(200).send({ message: 'Automation deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
