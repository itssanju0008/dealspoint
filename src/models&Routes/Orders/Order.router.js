const express = require('express');
const router = express.Router();
const Order = require('./Order.model');

// Create a new order (POST)
router.post('/', async (req, res) => {
  try {
    const { customer, products, status,delivery_address,payment_method } = req.body;

    // Calculate total price based on product prices and quantities
    const order_amount = products?.reduce(
      (acc, product) => acc + product.price * product.quantity, 0
    );

    const newOrder = new Order({
      customer,
      products,
      status,
      delivery_address,payment_method,order_amount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (GET)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders of a specific user by user ID
router.get('/user/:userId/orders', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all orders where the customer field matches the userId
    const userOrders = await Order.find({ customer: userId });

    if (!userOrders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(userOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific order by ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an order by ID (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { customer, products, status } = req.body;

    // Calculate new total price if products are updated
    const totalPrice = products.reduce(
      (acc, product) => acc + product.price * product.quantity, 0
    );

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { customer, products, status, totalPrice },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order by ID (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
