const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Hash the password with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
