const express = require("express");
const Visitor = require("./Visitor.model");

const router = express.Router();

/**
 * Route to handle visitor's visit
 * - If the user is new, create an entry with `count = 1`.
 * - If the user already exists, increment their visit count.
 */
router.post("/", async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if the user already exists
        let visitor = await Visitor.findOne({ user_id });

        if (visitor) {
            // Increment the visit count
            visitor.count += 1;
            await visitor.save();
            return res.status(200).json({
                message: "Visit count updated",
                visitor,
            });
        } else {
            // Create a new visitor
            visitor = new Visitor({ user_id, count: 1 });
            await visitor.save();
            return res.status(201).json({
                message: "New visitor recorded",
                visitor,
            });
        }
    } catch (error) {
        console.error("Error handling visitor:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Export the router
module.exports = router;
