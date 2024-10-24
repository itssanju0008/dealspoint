const express = require("express");
const router = express.Router();
const Category = require("./Categories.model");

// GET method to retrieve all grandparent categories
router.get("/", async (req, res) => {
  try {
    const { show } = req.query;
    // Find all categories without a parent (top-level categories)
    const topLevelCategories = await Category.find().lean();
    res.json(topLevelCategories);
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately (send error response, etc.)
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// POST method to create a new top-level category
router.post("/", async (req, res) => {
  try {
    const { name, image, gender } = req.body;
    console.log(req?.body);

    // Validate input
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    // Create a new top-level category
    const newCategory = new Category({
      name,
      image,
      gender,
      status: true,
      parent: null,
    });
    // Save the category to the database
    const savedCategory = await newCategory.save();
    // Send the saved category as JSON
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately (send error response, etc.)
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST method to create a new subcategory
module.exports = router;
