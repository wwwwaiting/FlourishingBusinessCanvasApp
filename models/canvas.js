var mongoose = require("mongoose");
var CanvasSchema = new mongoose.Schema({
  id: Number,
  owner: String,
  position: {
    width: Number,
    height: Number
  },
  title: String,
  users: [String],
  stickies: [Number]
});
module.exports = mongoose.model("Canvas", CanvasSchema);
