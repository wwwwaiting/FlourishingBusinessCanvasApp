var mongoose = require("mongoose");
var HistorySchema = new mongoose.Schema({
  stickyID: String,
  user: String,
  content: String,
  modifiedTime: Date
});
var CanvasSchema = new mongoose.Schema({
  owner: String,
  title: String,
  users: [String],  //email
  stickies: [String],
  createDate: Date,
  editHistory: [HistorySchema]  //history id
});
module.exports = mongoose.model("Canvas", CanvasSchema);
