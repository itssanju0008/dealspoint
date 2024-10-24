const mongoose = require('mongoose');

const PersonalitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    sort_order: { type: Number, default: 0 },
    count: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Personality = mongoose.model('Personality', PersonalitySchema);

module.exports = Personality;
