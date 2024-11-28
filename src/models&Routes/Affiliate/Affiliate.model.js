const mongoose = require("mongoose");

const load = {
  code: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
  },
};

const affiliateSchema = new mongoose.Schema(load, { versionKey: false });

const Affiliate = mongoose.model("Affiliate", affiliateSchema);

module.exports = Affiliate;
