const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  singer: {
    type: String,
    required: true
  },

  duration: String,

  // Cloudinary URL
  audioFile: String,

  // Cloudinary URL
  thumbnail: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Music", musicSchema);