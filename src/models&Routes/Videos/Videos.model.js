const mongoose = require("mongoose");

const load = {
  name: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "7h" }, 
  },
};

const videoSchema = new mongoose.Schema(load, {
  versionKey: false,
  timestamps: true,
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
