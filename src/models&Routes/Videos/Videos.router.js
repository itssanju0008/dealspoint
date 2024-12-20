const express = require("express");
const Video = require("./Videos.model");
const { default: axios } = require("axios");
const router = express.Router();
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
// Create a new video

router.post("/", async (req, res) => {
  try {
    const { name, image, url, type, category } = req.body;

    if (!image || !url) {
      return res
        .status(400)
        .json({ error: "Image and URL are required fields" });
    }

    // Step 1: Fetch the image from the provided URL
    const imageResponse = await axios({
      method: "GET",
      url: image, // Image URL
      responseType: "stream", // Fetch as a stream
    });
    const uniqueFilename = `uploaded_image_${Date.now()}_${uuidv4()}.jpg`;
    // Step 2: Prepare FormData for the upload
    const formData = new FormData();
    formData.append("file", imageResponse.data, {
      filename: uniqueFilename, // Specify the filename
      contentType: imageResponse.headers["content-type"], // Pass the content type from the response
    });

    // Step 3: Upload the image to another server
    const uploadResponse = await axios.post(
      "https://ar-hosting.pages.dev/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Proper headers with boundary
        },
      }
    );
    // Step 4: Extract the uploaded image URL from the response
    const uploadedImageUrl = uploadResponse.data.data; // Adjust based on your server's response structure
    if (!uploadedImageUrl) {
      throw new Error("Failed to retrieve uploaded image URL");
    }
    // Step 5: Save the video details in the database
    const video = new Video({
      name,
      category,
      type,
      image: uploadedImageUrl, // Use the URL of the uploaded image
      url,
    });

    await video.save();

    res.status(201).json({
      name: video.name,
      image: video.image,
      url: video.url,
    });
    
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "An error occurred while uploading the image" });
  }
});

// Get all videos with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Video.countDocuments();

    res.status(200).json({
      data: videos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to find a video by ID or URL
const findVideoByIdOrUrl = async (identifier) => {
  // Check if the identifier is a valid ObjectId
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

  if (isObjectId) {
    // Try to find by ObjectId
    const video = await Video.findById(identifier);
    if (video) return video;
  }

  // If not ObjectId or video not found, try to find by URL
  return await Video.findOne({ url: identifier });
};
// Get a video by ID or URL
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await findVideoByIdOrUrl(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a video
router.post("/:identifier/like", async (req, res) => {
  try {
    const { identifier } = req.params;
    const video = await findVideoByIdOrUrl(identifier);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.likes += 1;
    await video.save();

    res.status(200).json({ message: "Like added", video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dislike a video
router.post("/:identifier/dislike", async (req, res) => {
  try {
    const { identifier } = req.params;
    const video = await findVideoByIdOrUrl(identifier);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.dislikes += 1;
    await video.save();

    res.status(200).json({ message: "Dislike added", video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment views
router.post("/:identifier/view", async (req, res) => {
  try {
    const { identifier } = req.params;
    const video = await findVideoByIdOrUrl(identifier);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.views += 1;
    await video.save();

    res.status(200).json({ message: "View incremented", video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment votes
router.post("/:identifier/vote", async (req, res) => {
  try {
    const { identifier } = req.params;
    const video = await findVideoByIdOrUrl(identifier);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.votes += 1;
    await video.save();

    res.status(200).json({ message: "Vote incremented", video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a video by ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
