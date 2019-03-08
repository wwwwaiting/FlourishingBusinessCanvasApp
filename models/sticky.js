var mongoose = require("mongoose");
var StickySchema = new mongoose.Schema({
  id: Number,
  canvasId: Number,
  content: String,
  position: {
    left: Number,
    top: Number,
    width: Number,
    height: Number,
    textBoxWidth: Number,
    textBoxHeight: Number
  },
  color: String,
  modifiedTime: Date,
  hashtag: String,
  comment: [Number],
  editHistory: [Number],
  optionalFields: Object
});

module.exports = mongoose.model("Sticky", StickySchema);
