const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Order
const orderSchema = new Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending',
  },
  orderDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
