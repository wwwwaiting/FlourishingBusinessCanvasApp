var mongoose = require("mongoose");
var options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true
};


var url = "mongodb://csc301:csc301partner@ds247648.mlab.com:47648/csc301db";
var db = mongoose.connect(url,options);
