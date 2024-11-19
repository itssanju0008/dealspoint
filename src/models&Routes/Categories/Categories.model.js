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
    type: {
      type: String,
      enum: ["parent", "normal"],
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { versionKey: false }
);

// Middleware to ensure a normal category has a parent
categorySchema.pre("save", function (next) {
  if (this.type === "normal" && !this.parent) {
    return next(new Error("Normal categories must have a parent category."));
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
