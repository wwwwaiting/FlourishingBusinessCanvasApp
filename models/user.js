var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pwd: String,
  role: Number,
  canvas: [Number],
  occupation: String,
  status: Number,
  phone: String,
  company: String
});

module.exports = mongoose.model("User", UserSchema);
