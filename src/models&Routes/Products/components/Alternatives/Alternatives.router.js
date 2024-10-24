const { Router } = require("express");
const Alternative = require("./Alternatives.model");
const Product = require("../../Products.model"); // Import the Product model
const router = Router();

// Get all alternatives
router.get("/", async (req, res) => {
  try {
    const alternatives = await Alternative.find()
      .populate('product') // Populate the product reference
      .populate('alternatives') // Populate the alternatives references
      .exec();
    res.json(alternatives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get an alternative by ID
router.get("/:id", async (req, res) => {
  try {
    const alternative = await Alternative.findById(req.params.id)
      .populate('product') // Populate the product reference
      .populate('alternatives') // Populate the alternatives references
      .exec();
    if (!alternative) {
      return res.status(404).json({ message: "Alternative not found" });
    }
    res.json(alternative);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new alternative
router.post("/", async (req, res) => {
  const { product, alternatives } = req.body;

  // Validate that the product and alternatives are valid ObjectIds
  try {
    const newAlternative = new Alternative({
      product,
      alternatives,
    });

    await newAlternative.save();
    res.status(201).json(newAlternative);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an alternative by ID
router.put("/:id", async (req, res) => {
  const { product, alternatives } = req.body;

  try {
    const updatedAlternative = await Alternative.findByIdAndUpdate(
      req.params.id,
      { product, alternatives },
      { new: true } // Return the updated document
    )
      .populate('product') // Populate the product reference
      .populate('alternatives') // Populate the alternatives references
      .exec();

    if (!updatedAlternative) {
      return res.status(404).json({ message: "Alternative not found" });
    }

    res.json(updatedAlternative);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an alternative by ID
router.delete("/:id", async (req, res) => {
  try {
    const alternative = await Alternative.findByIdAndDelete(req.params.id);

    if (!alternative) {
      return res.status(404).json({ message: "Alternative not found" });
    }

    res.json({ message: "Alternative deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
