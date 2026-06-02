const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title:String,
    singer:String,
    duration:String,
    audioFile:String,
    thumbnail:String,
    createdBy:String,
     createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Music',musicSchema);