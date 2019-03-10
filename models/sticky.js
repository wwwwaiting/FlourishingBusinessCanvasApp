var mongoose = require("mongoose");
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
  comment: [Number],
  optionalFields: Object
});

module.exports = mongoose.model("Sticky", StickySchema);
