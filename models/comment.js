var mongoose = require("mongoose");
var CommentSchema = new mongoose.Schema({
  id: Number,
  stickyID: Number,
  user: String,
  content: String,
  modifiedTime: Date
});

module.exports = mongoose.model("Comment", CommentSchema);
