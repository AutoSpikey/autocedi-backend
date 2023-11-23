const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        return res.json({
            "message": "callback received successfully"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;