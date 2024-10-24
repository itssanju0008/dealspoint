const mongoose = require("mongoose");

const CharmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  colors:[{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
  image: {
    type: String,
    required: false, // If not required, adjust as needed
  },
  sort_order: { type: Number, default: 0 },
  gender: { type: String, required: true },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Charm = mongoose.model("ColorCombo", CharmSchema);

module.exports = Charm;
