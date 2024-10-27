// utils/emailService.js
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  name: "Crazydeals",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to load and replace placeholders in HTML template
const loadHtmlTemplate = (filePath, replacements) => {
  let html = fs.readFileSync(path.join(__dirname, filePath), "utf8");
  for (const key in replacements) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
  }
  return html;
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
// Function to send order confirmation email
async function sendOrderConfirmationEmail(order, type) {

  let mailOptions = {};
  const replacement = {
    order_id: order.order_no,
    order_date: formatDate(order.createdAt),
    order_amount: "₹" + order?.order_amount,
    name: order?.delivery_address?.name,
    phone: order?.delivery_address?.phone,
    address: order?.delivery_address?.address,
    city: order?.delivery_address?.city,
    zipcode: order?.delivery_address?.zipcode,
    state: order?.delivery_address?.state,
    email: order?.delivery_address?.email,
  };
  console.log({order,replacement});
  
  const html = loadHtmlTemplate("./emailTemplate.html", replacement);
  const html1 = loadHtmlTemplate("./emailTemplate.html", replacement);
  if (type === "user") {
    mailOptions = {
      from: `Crazydeals <no-reply${process.env.EMAIL_USER}>`,
      to: order.delivery_address.email,
      subject: "Order Confirmation",
      html: html,
    };
  } else {
    mailOptions = {
      from: `Crazydeals <${process.env.EMAIL_USER}>`,
      to: order.delivery_address.email,
      subject: "Order Confirmation",
      html: html1,
    };
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {}
}

module.exports = { sendOrderConfirmationEmail };
