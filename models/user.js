var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pwd: String,
  role: Number,
  canvas: [Number],
  occupation: String,
  status: Number
});

module.exports = mongoose.model("User", UserSchema);
