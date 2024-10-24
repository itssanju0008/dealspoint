const express = require('express');
const Weather = require('./Weathers.model');

const router = express.Router();

// Create a new weather entry
router.post('/', async (req, res) => {
    try {
        const { name, image, count ,gender,sort_order } = req.body;
        const weather = new Weather({ name, image, count ,gender,sort_order});
        await weather.save();
        res.status(201).json(weather);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all weather entries
router.get('/', async (req, res) => {
    try {
        const weathers = await Weather.find();
        res.status(200).json(weathers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a specific weather entry by ID
router.get('/:id', async (req, res) => {
    try {
        const weather = await Weather.findById(req.params.id);
        if (!weather) return res.status(404).json({ error: 'Weather not found' });
        res.status(200).json(weather);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a specific weather entry by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, image, count,gender,sort_order } = req.body;
        const weather = await Weather.findByIdAndUpdate(
            req.params.id,
            { name, image, count ,gender,sort_order},
            { new: true }
        );
        if (!weather) return res.status(404).json({ error: 'Weather not found' });
        res.status(200).json(weather);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a specific weather entry by ID
router.delete('/:id', async (req, res) => {
    try {
        const weather = await Weather.findByIdAndDelete(req.params.id);
        if (!weather) return res.status(404).json({ error: 'Weather not found' });
        res.status(200).json({ message: 'Weather deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
