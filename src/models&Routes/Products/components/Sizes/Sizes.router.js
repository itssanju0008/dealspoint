// Sizes.router.js
const express = require('express');
const router = express.Router();
const Size = require('./Sizes.model');

// Get all sizes
router.get('/', async (req, res) => {
    try {
        const sizes = await Size.find();
        res.status(200).json(sizes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a size by ID
router.get('/:id', async (req, res) => {
    try {
        const size = await Size.findById(req.params.id);
        if (!size) return res.status(404).json({ message: 'Size not found' });
        res.status(200).json(size);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new size
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    const size = new Size({
        name,
        description
    });

    try {
        const newSize = await size.save();
        res.status(201).json(newSize);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a size
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;

    try {
        const updatedSize = await Size.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );
        if (!updatedSize) return res.status(404).json({ message: 'Size not found' });
        res.status(200).json(updatedSize);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a size
router.delete('/:id', async (req, res) => {
    try {
        const deletedSize = await Size.findByIdAndDelete(req.params.id);
        if (!deletedSize) return res.status(404).json({ message: 'Size not found' });
        res.status(200).json({ message: 'Size deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
