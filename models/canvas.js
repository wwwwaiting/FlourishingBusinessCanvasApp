var mongoose = require("mongoose");
var CanvasSchema = new mongoose.Schema({
  id: Number,
  owner: String,
  title: String,
  users: [String],  //email
  stickies: [Number],
  createDate: Date,
  editHistory: [Number]  //history id
});
module.exports = mongoose.model("Canvas", CanvasSchema);
