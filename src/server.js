const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const { connection } = require("./config/db");
const http = require("http");
const cors = require("cors");

// // Importing routers
const productsRouter = require("./models&Routes/Products/Products.router");
const brandRouter = require("./models&Routes/Brands/Brands.router");
const trackRouter = require("./models&Routes/Actions/Actions.router");

const orderRouter = require("./models&Routes/Orders/Order.router");
const videoRouter = require("./models&Routes/Videos/Videos.router");
const userRouter = require("./models&Routes/Users/Users.router");
const categoryRouter = require("./models&Routes/Categories/Categories.router"); // Import categoryRouter
const { sendOrderConfirmationEmail } = require("./utils/emailService");

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://carrystyle.in",
      'https://www.carrystyle.in',
      'https://www.cd.quicsy.com',
      'https://www.crazydeals.buzz'
    ], // Fixing the CORS allowed origins
  })
);

// Test route
app.get("/test", (req, res) => {
  const savedOrder={delivery_address:{email:'sanju682295@gmail.com'},order_no:'8999899',order_amount:699}
  sendOrderConfirmationEmail(savedOrder,'user');
  return res.json({
    message: "API is working",
    port: process?.env?.PORT,
  });
});

// Registering routes
app.use("/products", productsRouter);
app.use("/brands", brandRouter); // Assuming you also want to use brandRouter
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/track", trackRouter);
app.use("/videos", videoRouter);


// Starting the server
const PORT = process.env.PORT || 6000;
server.listen(PORT, async () => {
  try {
    // Connect to the database
    await connection();
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error("Error:", err);
  }
});
