const mongoose = require("mongoose");

const load = {
  user_id: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
};

const visitorSchema = new mongoose.Schema(load, { versionKey: false,timestamps:true });

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
