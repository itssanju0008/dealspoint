const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
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

const Weather = mongoose.model('Weather', WeatherSchema);

module.exports = Weather;
