const express = require("express");
const router = express.Router();
const Category = require("./Categories.model");

// CREATE a new category
router.post("/", async (req, res) => {
  try {
    const { name, sort_order, status, image } = req.body;

    // Check for required fields
    if (!name || !sort_order) {
      return res.status(400).json({ error: "Name and sort_order are required." });
    }

    // Create a new category
    const newCategory = new Category({ name, sort_order, status, image });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name must be unique." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ all categories, sorted by sort_order
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ sort_order: 1 }).lean(); // Sorted by sort_order in ascending order
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).lean();

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE a category by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sort_order, status, image } = req.body;

    // Validate required fields
    if (!name || !sort_order) {
      return res.status(400).json({ error: "Name and sort_order are required." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, sort_order, status, image },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name must be unique." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and remove the category
    const categoryToDelete = await Category.findByIdAndDelete(id);

    if (!categoryToDelete) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
