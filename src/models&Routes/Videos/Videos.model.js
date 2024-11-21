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
  },
  views: {
    type: Number,
    default: () => Math.floor(Math.random() * 9000) + 1000, // Random number between 1000 and 9999
    min: 1000,
  },
  likes: {
    type: Number,
    default: function () {
      return Math.floor(Math.random() * (this.views - 1000)) + 1000; // Less than views
    },
    min: 1000,
    validate: {
      validator: function (value) {
        return value < this.views;
      },
      message: "Likes must be less than views.",
    },
  },
  votes: {
    type: Number,
    default: function () {
      return Math.floor(Math.random() * (this.views - 1000)) + 1000; // Less than views
    },
    min: 1000,
    validate: {
      validator: function (value) {
        return value < this.views;
      },
      message: "Votes must be less than views.",
    },
  },
  dislikes: {
    type: Number,
    default: 1,
  },
};

const videoSchema = new mongoose.Schema(load, {
  versionKey: false,
  timestamps: true,
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
