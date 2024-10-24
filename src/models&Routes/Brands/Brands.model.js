const mongoose = require("mongoose");

const load = {
  name: {
    type: String,
    required: true, // Ensures that the name is provided
  },
  image: {
    type: String,
    default: "default-image-url.jpg", // Default image if none is provided
  },
  sort_order: {
    type: Number, // Change to Number for better sorting
    required: true,
  },
};

const brandSchema = new mongoose.Schema(load, { versionKey: false });

const Brand = mongoose.model("Brands", brandSchema);

module.exports = Brand;
