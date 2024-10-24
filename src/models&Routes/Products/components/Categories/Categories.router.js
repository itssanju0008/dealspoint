const express = require("express");
const router = express.Router();
const Category = require("./Categories.model");

// GET method to retrieve all grandparent categories
router.get("/", async (req, res) => {
  try {
    const { show } = req.query;
    // Find all categories without a parent (top-level categories)
    if (show === "all") {
      const topLevelCategories = await Category.find()
      .populate({
        path: "subcategories",
        populate: {
          path: "subcategories",
          model: "Category",
        },
      })
      .populate({path:"parent", populate: {
        path: "parent",
        model: "Category",
      }})
      .lean();
      res.json(topLevelCategories);
    } else {
      const topLevelCategories = await Category.find({ parent: null }).populate({
        path: "subcategories",
        populate: {
          path: "subcategories",
          model: "Category",
        },
      })
      .populate({path:"parent", populate: {
        path: "parent",
        model: "Category",
      },})
      .lean();
      res.json(topLevelCategories);
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately (send error response, etc.)
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// POST method to create a new top-level category
router.post("/", async (req, res) => {
  try {
    const { name, image, wear,gender } = req.body;
    console.log(req?.body);
    
    // Validate input
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    // Create a new top-level category
    const newCategory = new Category({
      name,
      image,
      wear,
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
router.post("/:parentId", async (req, res) => {
  try {
    const { name, image, wear,gender } = req.body;
    const parentId = req.params.parentId;

    // Validate input
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check if the parent category exists
    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    // Create a new subcategory
    const newSubCategory = new Category({
      name,
      image,
      wear,
      gender,
      status: true,
      parent: parentId,
    });

    // Save the subcategory to the database
    const savedSubCategory = await newSubCategory.save();

    // Add the subcategory to the parent's subcategories array
    parentCategory.subcategories.push(savedSubCategory._id);
    await parentCategory.save();

    // Send the saved subcategory as JSON
    res.status(201).json(savedSubCategory);
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately (send error response, etc.)
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
