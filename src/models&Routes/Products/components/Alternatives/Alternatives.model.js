const mongoose = require("mongoose");

const AlternativeSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,  // Change to ObjectId
    ref: "Product",  // Reference to the Product model
    required: true,
    unique: true,
  },
  alternatives: [{
    type: mongoose.Schema.Types.ObjectId,  // Array of ObjectIds
    ref: "Product",  // Reference to the Product model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alternative = mongoose.model("Alternative", AlternativeSchema);

module.exports = Alternative;
