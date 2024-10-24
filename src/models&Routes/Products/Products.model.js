const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    keywords: String,
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    review: Number,
    review_count: Number,
    product_description: { type: String },
    specifications: { type: String },
    variations: [ ],
    seller: String,
    past_sold: Number,
    thumbnail: String,
    mrp: Number,
    price: Number,
  },
  { versionKey: false }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
