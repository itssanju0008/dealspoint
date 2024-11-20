const express = require("express");
const Video = require("./Videos.model");
const { default: axios } = require("axios");
const router = express.Router();
const FormData = require("form-data");

// Create a new video

router.post("/", async (req, res) => {
  try {
    const { name, image, url } = req.body;

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

    // Step 2: Prepare FormData for the upload
    const formData = new FormData();
    formData.append("file", imageResponse.data, {
      filename: "uploaded_image.jpg", // Specify the filename
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
      image: uploadedImageUrl, // Use the URL of the uploaded image
      url,
    });

    await video.save();

    res.status(201).json(video);
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
// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a video by ID
router.get("/:id", async (req, res) => {
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
