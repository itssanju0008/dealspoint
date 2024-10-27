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
  console.log({ order, replacement });

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

  const mailData = {
    from: `New Order <${process.env.EMAIL_USER}>`,
    to: "sanju682295@gmail.com",
    subject: "New Order Received.",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h2 {
                color: #333;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #666;
            }
        </style>
    </head>
    <body>

    <div class="container">
        <h2>New Order Received!</h2>
        <p>You have received a new order.</p>
        <p>Please check your dashboard for more details.</p>
    </div>

    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Crazydeals</p>
    </div>

    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailData);
  } catch (error) {}
}

module.exports = { sendOrderConfirmationEmail };
