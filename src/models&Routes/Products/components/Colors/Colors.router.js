// Colors.router.js
const express = require('express');
const router = express.Router();
const Color = require('./Colors.model');

// Get all colors
router.get('/', async (req, res) => {
    try {
        const colors = await Color.find();
        res.status(200).json(colors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a color by ID
router.get('/:id', async (req, res) => {
    try {
        const color = await Color.findById(req.params.id);
        if (!color) return res.status(404).json({ message: 'Color not found' });
        res.status(200).json(color);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new color
router.post('/', async (req, res) => {
    const { name, image } = req.body;

    const color = new Color({
        name,
        image // Add imageUrl field
    });

    try {
        const newColor = await color.save();
        res.status(201).json(newColor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a color
router.put('/:id', async (req, res) => {
    const { name, image } = req.body;

    try {
        const updatedColor = await Color.findByIdAndUpdate(
            req.params.id,
            { name, image }, // Update imageUrl field
            { new: true, runValidators: true }
        );
        if (!updatedColor) return res.status(404).json({ message: 'Color not found' });
        res.status(200).json(updatedColor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a color
router.delete('/:id', async (req, res) => {
    try {
        const deletedColor = await Color.findByIdAndDelete(req.params.id);
        if (!deletedColor) return res.status(404).json({ message: 'Color not found' });
        res.status(200).json({ message: 'Color deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
