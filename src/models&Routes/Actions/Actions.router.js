// actions.router.js
const express = require("express");
const router = express.Router();
const Action = require("./Actions.model");

// Route to log a new action
router.post("/", async (req, res) => {
  try {
    const { action, productId, userId, page ,city} = req.body;

    if (!page) {
      return res
        .status(400)
        .json({ error: "Page are required" });
    }

    const newAction = new Action({ action, productId, userId, page, city });
    await newAction.save();

    res.status(201).json({ message: "Action tracked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to track action" });
  }
});

// Route to retrieve all actions for analysis (optional)
router.get("/actions", async (req, res) => {
  try {
    const actions = await Action.find();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve actions" });
  }
});

module.exports = router;
