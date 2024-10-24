const express = require('express');
const ColorCombo = require('./ColorCombos.model');

const router = express.Router();

// Create a new colorCombo
router.post('/', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const colorCombo = new ColorCombo({ name, image, count,gender,sort_order });
        await colorCombo.save();
        res.status(201).json(colorCombo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all colorCombo
router.get('/', async (req, res) => {
    try {
        const colorCombo = await ColorCombo.find();
        res.status(200).json(colorCombo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific colorCombo by ID
router.get('/:id', async (req, res) => {
    try {
        const colorCombo = await ColorCombo.findById(req.params.id);
        if (!colorCombo) return res.status(404).json({ error: 'Color Combo not found' });
        res.status(200).json(colorCombo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific colorCombo by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const colorCombo = await ColorCombo.findByIdAndUpdate(
            req.params.id,
            { name, image, count,gender,sort_order },
            { new: true }
        );
        if (!colorCombo) return res.status(404).json({ error: 'Color Combo not found' });
        res.status(200).json(colorCombo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific charm by ID
router.delete('/:id', async (req, res) => {
    try {
        const colorCombo = await ColorCombo.findByIdAndDelete(req.params.id);
        if (!colorCombo) return res.status(404).json({ error: 'Color Combo not found' });
        res.status(200).json({ message: 'Color Combo deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
