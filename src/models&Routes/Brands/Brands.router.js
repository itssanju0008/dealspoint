const express = require("express");
const router = express.Router();
const Brand = require("./Brands.model"); // Assuming this is the model file path

// CREATE a new brand
router.post("/", async (req, res) => {
  try {
    const { name, image, sort_order } = req.body;

    // Check for required fields
    if (!name || !sort_order) {
      return res.status(400).json({ error: "Name and sort_order are required." });
    }

    // Create a new brand
    const newBrand = new Brand({ name, image, sort_order });
    const savedBrand = await newBrand.save();

    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ all brands, sorted by sort_order
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ sort_order: 1 }).lean(); // Sort by sort_order
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ a specific brand by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id).lean();

    if (!brand) {
      return res.status(404).json({ error: "Brand not found." });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE a brand by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, sort_order } = req.body;

    // Validate required fields
    if (!name || !sort_order) {
      return res.status(400).json({ error: "Name and sort_order are required." });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, image, sort_order },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found." });
    }

    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a brand by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and remove the brand
    const brandToDelete = await Brand.findByIdAndDelete(id);

    if (!brandToDelete) {
      return res.status(404).json({ error: "Brand not found." });
    }

    res.json({ message: "Brand deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
