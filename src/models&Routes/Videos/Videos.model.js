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
  },
};

const videoSchema = new mongoose.Schema(load, { versionKey: false });

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;