var mongoose = require("mongoose");
var HistorySchema = new mongoose.Schema({
  id: Number,
  stickyID: Number,
  user: String,
  content: String,
  modifiedTime: Date
});

module.exports = mongoose.model("History", HistorySchema);
