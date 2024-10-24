const { Router } = require("express");
const Variants = require("./Variants.model");
const router = Router();

// Get all variants
router.get("/", async (req, res) => {
  try {
    const variants = await Variants.find()
      .populate('productId') // Optional: Populate product info if needed
      .populate('weathers')
      .exec();
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get variants by product ID
router.get("/product/:productId", async (req, res) => {
  try {
    const variants = await Variants.find({ productId: req.params.productId }).exec();
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single variant by ID
router.get("/:id", getVariant, (req, res) => {
  res.json(res.variant);
});

// Create a new variant
router.post("/", async (req, res) => {
  const variant = new Variants(req.body);
  try {
    const newVariant = await variant.save();
    res.status(201).json(newVariant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a variant by ID
router.put("/:id", getVariant, async (req, res) => {
  try {
    await Variants.findByIdAndUpdate(req.params.id, req.body);
    const updatedVariant = await Variants.findById(req.params.id);
    res.json(updatedVariant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a variant by ID
router.delete("/:id", getVariant, async (req, res) => {
  try {
    await res.variant.remove();
    res.json({ message: "Variant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get the variant by ID
async function getVariant(req, res, next) {
  let variant;
  try {
    variant = await Variants.findById(req.params.id);
    if (variant == null) {
      return res.status(404).json({ message: "Variant not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.variant = variant;
  next();
}

module.exports = router;
