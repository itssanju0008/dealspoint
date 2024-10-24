const express = require('express');
const Look = require('./Looks.model');

const router = express.Router();

// Create a new look
router.post('/', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const look = new Look({ name, image, count,gender,sort_order });
        await look.save();
        res.status(201).json(look);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all looks
router.get('/', async (req, res) => {
    try {
        const looks = await Look.find();
        res.status(200).json(looks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific look by ID
router.get('/:id', async (req, res) => {
    try {
        const look = await Look.findById(req.params.id);
        if (!look) return res.status(404).json({ error: 'Look not found' });
        res.status(200).json(look);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific look by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const look = await Look.findByIdAndUpdate(
            req.params.id,
            { name, image, count,gender,sort_order },
            { new: true }
        );
        if (!look) return res.status(404).json({ error: 'Look not found' });
        res.status(200).json(look);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific look by ID
router.delete('/:id', async (req, res) => {
    try {
        const look = await Look.findByIdAndDelete(req.params.id);
        if (!look) return res.status(404).json({ error: 'Look not found' });
        res.status(200).json({ message: 'Look deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
