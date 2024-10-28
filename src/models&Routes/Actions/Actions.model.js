// actions.model.js
const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema({
   action: {
      type: String,
      required: true,
   },
   city: {
    type: String,
 },
   productId: {
      type: String,
      required: false, // Not required for "checkout" or general actions
   },
   userId: {
      type: String,
      required: false,
   },
   page: {
      type: String,
      required: true, // E.g., "/product/123", "/checkout"
   },
   timestamp: {
      type: Date,
      default: Date.now,
   },
});

const Action = mongoose.model("Action", ActionSchema);

module.exports = Action;
