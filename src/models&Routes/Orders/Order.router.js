const express = require("express");
const router = express.Router();
const Order = require("./Order.model");
const { sendOrderConfirmationEmail } = require("../../utils/emailService");
const User = require("../Users/Users.model");
const bcrypt = require("bcrypt");

// Create a new order (POST)
router.post("/", async (req, res) => {
  try {
    const { customer, products, status, delivery_address, payment_method } =
      req.body;

    // Step 1: Check if user already exists
    let user = await User.findOne({ email: delivery_address?.email });

    // Step 2: If user doesn't exist, create a new user with a default password
    if (!user) {
      const hashedPassword = await bcrypt.hash("12345678", 10); // Hash the default password
      user = await User.create({
        name: delivery_address?.name,
        email: delivery_address?.email,
        password: hashedPassword, // Save the hashed password
      });
    }

    // Calculate total price based on product prices and quantities
    const order_amount = products.reduce((acc, product) => {
      const price = Number(product.price); // Ensure price is a number
      const quantity = Number(product.quantity); // Ensure quantity is a number
      return acc + price * quantity;
    }, 0);

    // Retrieve the last order number and increment it
    const lastOrder = await Order.findOne().sort({ order_no: -1 }).limit(1);
    const nextOrderNo = lastOrder ? lastOrder.order_no + 1 : 8000000; // Start from 8000000 if no orders exist

    // Ensure nextOrderNo is a number
    if (isNaN(nextOrderNo)) {
      return res.status(500).json({ error: "Failed to generate order number" });
    }
    const newOrder = new Order({
      order_no: nextOrderNo,
      customer: customer || user._id,
      products,
      status,
      delivery_address,
      payment_method,
      order_amount,
      order_process: [
        { status: "Pending", date: new Date().toISOString() } // Add initial order status with timestamp
      ],
    });

    const savedOrder = await newOrder.save();
    if (user) {
      await sendOrderConfirmationEmail(savedOrder, "user");
    } else {
      await sendOrderConfirmationEmail(savedOrder, "nouser");
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status route
router.put("/update-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Shipped", "Out for Delivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status provided" });
    }

    // Find the order and update the order_process array with the new status and timestamp
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Add the new status with the current timestamp
    order.order_process.push({ status, date: new Date().toISOString() });

    // Update the overall status of the order
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({ message: "Order status updated successfully", updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (GET)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders of a specific user by user ID
router.get("/user/:userId/orders", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all orders where the customer field matches the userId
    const userOrders = await Order.find({ customer: userId });

    if (!userOrders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.status(200).json(userOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific order by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an order by ID (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { customer, products, status } = req.body;

    // Calculate new total price if products are updated
    const totalPrice = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { customer, products, status, totalPrice },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track order route
router.get("/track/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and populate customer details if needed
    const order = await Order.findById(orderId).populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Respond with the order info including the status history in order_process
    res.status(200).json({
      order_no: order.order_no,
      customer: order.customer,
      products: order.products,
      status: order.status,
      delivery_address: order.delivery_address,
      payment_method: order.payment_method,
      order_amount: order.order_amount,
      order_process: order.order_process, // History of status changes with timestamps
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete an order by ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
