const express = require('express');
const SizeChart = require('./SizeCharts.model');

const router = express.Router();

// Create a new SizeChart
router.post('/', async (req, res) => {
  try {
    const sizeChart = new SizeChart(req.body);
    await sizeChart.save();
    res.status(201).json(sizeChart);
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
});

// Get all SizeCharts
router.get('/', async (req, res) => {
  try {
    const sizeCharts = await SizeChart.find();
    res.json(sizeCharts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single SizeChart by ID
router.get('/:id', async (req, res) => {
  try {
    const sizeChart = await SizeChart.findById(req.params.id);
    if (!sizeChart) return res.status(404).json({ message: 'SizeChart not found' });
    res.json(sizeChart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a SizeChart by ID
router.put('/:id', async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sizeChart) return res.status(404).json({ message: 'SizeChart not found' });
    res.json(sizeChart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a SizeChart by ID
router.delete('/:id', async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndDelete(req.params.id);
    if (!sizeChart) return res.status(404).json({ message: 'SizeChart not found' });
    res.json({ message: 'SizeChart deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
