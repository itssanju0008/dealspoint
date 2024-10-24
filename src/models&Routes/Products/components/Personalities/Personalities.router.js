const express = require('express');
const Personality = require('./Personalities.model');

const router = express.Router();

// Create a new personality
router.post('/', async (req, res) => {
    try {
        const { name, image, count, gender ,sort_order} = req.body;
        const personality = new Personality({ name, image, count, gender,sort_order });
        await personality.save();
        res.status(201).json(personality);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all personalities
router.get('/', async (req, res) => {
    try {
        const personalities = await Personality.find();
        res.status(200).json(personalities);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific personality by ID
router.get('/:id', async (req, res) => {
    try {
        const personality = await Personality.findById(req.params.id);
        if (!personality) return res.status(404).json({ error: 'Personality not found' });
        res.status(200).json(personality);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific personality by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const personality = await Personality.findByIdAndUpdate(
            req.params.id,
            { name, image, count ,gender,sort_order},
            { new: true }
        );
        if (!personality) return res.status(404).json({ error: 'Personality not found' });
        res.status(200).json(personality);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific personality by ID
router.delete('/:id', async (req, res) => {
    try {
        const personality = await Personality.findByIdAndDelete(req.params.id);
        if (!personality) return res.status(404).json({ error: 'Personality not found' });
        res.status(200).json({ message: 'Personality deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
