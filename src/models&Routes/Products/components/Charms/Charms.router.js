const express = require('express');
const Charm = require('./Charms.model');

const router = express.Router();

// Create a new charm
router.post('/', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const charm = new Charm({ name, image, count,gender,sort_order });
        await charm.save();
        res.status(201).json(charm);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all charms
router.get('/', async (req, res) => {
    try {
        const charms = await Charm.find();
        res.status(200).json(charms);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific charm by ID
router.get('/:id', async (req, res) => {
    try {
        const charm = await Charm.findById(req.params.id);
        if (!charm) return res.status(404).json({ error: 'Charm not found' });
        res.status(200).json(charm);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific charm by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const charm = await Charm.findByIdAndUpdate(
            req.params.id,
            { name, image, count,gender,sort_order },
            { new: true }
        );
        if (!charm) return res.status(404).json({ error: 'Charm not found' });
        res.status(200).json(charm);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific charm by ID
router.delete('/:id', async (req, res) => {
    try {
        const charm = await Charm.findByIdAndDelete(req.params.id);
        if (!charm) return res.status(404).json({ error: 'Charm not found' });
        res.status(200).json({ message: 'Charm deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
