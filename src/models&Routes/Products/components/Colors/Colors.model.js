// Colors.model.js
const mongoose = require('mongoose');

// Define the Colors schema
const ColorsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
        required: false, // Optional field
        // validate: {
        //     validator: function(v) {
        //         return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid URL!`
        // }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Colors model
const Color = mongoose.model('Color', ColorsSchema);

module.exports = Color;
