const mongoose = require('mongoose');

const sizeChartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  columns: {
    type: [String],
    required: true,
  },
  rows: [
    {
      type: Map,
      of: String,
    },
  ],
  rowsInCm: [
    {
      type: Map,
      of: String,
    },
  ],
  image: {
    type: String,
  },
  howToMeasure: {
    type: String,
  },
}, {
  timestamps: true,
});

const SizeChart = mongoose.model('SizeChart', sizeChartSchema);

module.exports = SizeChart;
