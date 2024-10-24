const express = require('express');
const ColorLover = require('./ColorLovers.model');

const router = express.Router();

// Create a new color lover
router.post('/', async (req, res) => {
    try {
        const { name, image, count,gender ,sort_order} = req.body;
        const colorLover = new ColorLover({ name, image, count,gender ,sort_order});
        await colorLover.save();
        res.status(201).json(colorLover);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all color lovers
router.get('/', async (req, res) => {
    try {
        const colorLovers = await ColorLover.find();
        res.status(200).json(colorLovers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific color lover by ID
router.get('/:id', async (req, res) => {
    try {
        const colorLover = await ColorLover.findById(req.params.id);
        if (!colorLover) return res.status(404).json({ error: 'Color Lover not found' });
        res.status(200).json(colorLover);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific color lover by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const colorLover = await ColorLover.findByIdAndUpdate(
            req.params.id,
            { name, image, count,gender,sort_order },
            { new: true }
        );
        if (!colorLover) return res.status(404).json({ error: 'Color Lover not found' });
        res.status(200).json(colorLover);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific color lover by ID
router.delete('/:id', async (req, res) => {
    try {
        const colorLover = await ColorLover.findByIdAndDelete(req.params.id);
        if (!colorLover) return res.status(404).json({ error: 'Color Lover not found' });
        res.status(200).json({ message: 'Color Lover deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
