// Sizes.model.js
const mongoose = require('mongoose');

// Define the Sizes schema
const SizesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Sizes model
const Size = mongoose.model('Size', SizesSchema);

module.exports = Size;
