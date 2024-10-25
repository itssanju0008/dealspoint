const express = require("express");
const User = require("./Users.model"); // Assuming the model is in the same folder
const router = express.Router();
const jwt = require("jsonwebtoken");
// Route: Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Create new user
    const user = new User({ name, email, password, phone });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: Login a user
// Inside your login route in the backend
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find user by email
      const user = await User.findOne({ email }).select("+password"); // Assuming you have password field set as select: false
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      // Check password
      const isMatch = await user.comparePassword(password); // Assuming you have a method to compare passwords
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Generate JWT token
      const _token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expiry time
      });
  
      // Exclude sensitive fields like password before sending user data
      const userDetails = user.toObject();
      delete userDetails.password; // Remove password field
  
      // Return the token and user details in the response
      res.status(200).json({
        _token,
        data: {
          user: userDetails, // Full user details
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

// Route: Get user details by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: Update user details by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
