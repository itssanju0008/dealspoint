const express = require('express');
const Occasion = require('./Occasions.model');

const router = express.Router();

// Create a new occasion
router.post('/', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const occasion = new Occasion({ name, image, count,gender,sort_order });
        await occasion.save();
        res.status(201).json(occasion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all occasions
router.get('/', async (req, res) => {
    try {
        const occasions = await Occasion.find();
        res.status(200).json(occasions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific occasion by ID
router.get('/:id', async (req, res) => {
    try {
        const occasion = await Occasion.findById(req.params.id);
        if (!occasion) return res.status(404).json({ error: 'Occasion not found' });
        res.status(200).json(occasion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific occasion by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const occasion = await Occasion.findByIdAndUpdate(
            req.params.id,
            { name, image, count,gender,sort_order },
            { new: true }
        );
        if (!occasion) return res.status(404).json({ error: 'Occasion not found' });
        res.status(200).json(occasion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific occasion by ID
router.delete('/:id', async (req, res) => {
    try {
        const occasion = await Occasion.findByIdAndDelete(req.params.id);
        if (!occasion) return res.status(404).json({ error: 'Occasion not found' });
        res.status(200).json({ message: 'Occasion deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
