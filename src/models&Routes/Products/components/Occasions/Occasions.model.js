const mongoose = require('mongoose');

const OccasionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: false,
    },
    sort_order: { type: Number, default: 0 },
    image: {
        type: String,
        required: false,
    },
    count: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Occasion = mongoose.model('Occasion', OccasionSchema);

module.exports = Occasion;
