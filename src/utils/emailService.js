// utils/emailService.js

const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send order confirmation email
async function sendOrderConfirmationEmail(order) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.deliver_address.email,
    subject: "Order Confirmation",
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order ID: ${order.order_no}</p>
      <p>Total Amount: ₹${order.order_amount}</p>
        <p>We have also created an account for you using this email <b>${order?.deliver_address?.email} </b>.</p>
      <p>Your initial password is: <b>12345678</b></p>
      <p>We will notify you when your order out for delivery.</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendOrderConfirmationEmail };
