const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sort_order: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "default-image-url.jpg",
    },
  },
  { versionKey: false }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
