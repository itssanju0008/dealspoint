const express = require("express");
const Video = require("./Videos.model");
const router = express.Router();

// Create a new video
router.post("/videos", async (req, res) => {
  try {
    const { name, image, url } = req.body;

    if (!image || !url) {
      return res
        .status(400)
        .json({ error: "Image and URL are required fields" });
    }

    const video = new Video({ name, image, url });
    await video.save();

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a video by ID
router.get("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a video by ID
router.put("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, url } = req.body;

    const video = await Video.findByIdAndUpdate(
      id,
      { name, image, url },
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a video by ID
router.delete("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
