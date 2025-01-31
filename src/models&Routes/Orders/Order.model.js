const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for Order
const orderSchema = new Schema({
  order_no: {
    type: Number,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  delivery_address: {},
  payment_method: String,
  products: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      product_name: { type: String, required: true },
      variation: {},
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: String,
      price: Number,
      mrp: Number,
      sub_total: Number,
      category: String,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Shipped","Out For Delivery", "Delivered", "Cancelled","Returned"],
    default: "Pending",
  },
  orderDate: { type: Date, default: Date.now },
  order_amount: { type: Number, required: true },
  order_process:[]
},{ timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
