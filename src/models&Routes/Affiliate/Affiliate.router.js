const express = require("express");
const Affiliate = require("./Affiliate.model"); // Assuming this is the path to the model
const router = express.Router();

// CREATE a new affiliate
router.post("/", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required." });
    }

    const affiliate = new Affiliate({ code });
    await affiliate.save();
    res.status(201).json({ message: "Affiliate created successfully.", affiliate });
  } catch (error) {
    res.status(500).json({ message: "Failed to create affiliate.", error: error.message });
  }
});

// READ all affiliates
router.get("/", async (req, res) => {
  try {
    const affiliates = await Affiliate.find();
    res.status(200).json(affiliates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch affiliates.", error: error.message });
  }
});

// READ a single affiliate by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.findById(id);

    if (!affiliate) {
      return res.status(404).json({ message: "Affiliate not found." });
    }

    res.status(200).json(affiliate);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch affiliate.", error: error.message });
  }
});

// UPDATE an affiliate by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, count } = req.body;

    const updatedAffiliate = await Affiliate.findByIdAndUpdate(
      id,
      { code, count },
      { new: true, runValidators: true }
    );

    if (!updatedAffiliate) {
      return res.status(404).json({ message: "Affiliate not found." });
    }

    res.status(200).json({ message: "Affiliate updated successfully.", updatedAffiliate });
  } catch (error) {
    res.status(500).json({ message: "Failed to update affiliate.", error: error.message });
  }
});

// Increase the count of an affiliate by its code
router.patch("/increment/:code", async (req, res) => {
    try {
      const { code } = req.params;
  
      const updatedAffiliate = await Affiliate.findOneAndUpdate(
        { code }, // Find by code
        { $inc: { count: 1 } }, // Increment count by 1
        { new: true } // Return the updated document
      );
  
      if (!updatedAffiliate) {
        return res.status(404).json({ message: "Affiliate not found with the provided code." });
      }
  
      res.status(200).json({
        message: "Affiliate count incremented successfully.",
        affiliate: updatedAffiliate,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to increment affiliate count.",
        error: error.message,
      });
    }
  });
  

// DELETE an affiliate by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAffiliate = await Affiliate.findByIdAndDelete(id);

    if (!deletedAffiliate) {
      return res.status(404).json({ message: "Affiliate not found." });
    }

    res.status(200).json({ message: "Affiliate deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete affiliate.", error: error.message });
  }
});

module.exports = router;
