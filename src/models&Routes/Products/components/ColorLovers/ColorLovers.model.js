const mongoose = require('mongoose');

const ColorLoverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    gender:{type:String,required:true},
    sort_order: { type: Number, default: 0 },
    image: {
        type: String,
        required: false,  // If not required, adjust as needed
    },
    count: {
        type: Number,
        required: true,
        default: 0,
    },
});

const ColorLover = mongoose.model('ColorLover', ColorLoverSchema);

module.exports = ColorLover;
