var mongoose = require("mongoose");
var CommentSchema = new mongoose.Schema({
  id: Number,
  user: String,
  content: String,
  modifiedTime: Date
});
var StickySchema = new mongoose.Schema({
  id: Number,
  canvasId: Number,
  content: String,  // hashtag in content
  position: {
    left: Number,
    top: Number
  },
  size :{
  	width: Number,
    height: Number
  },
  color: String,
  modifiedTime: Date,
  title: String, 
  comment: [CommentSchema],
  optionalFields: Object
});

module.exports = mongoose.model("Sticky", StickySchema);
