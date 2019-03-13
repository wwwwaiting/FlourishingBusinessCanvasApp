var mongoose = require("mongoose");
var options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true
};


// var url = "mongodb://csc301:csc301partner@ds247648.mlab.com:47648/csc301db";
var url = "mongodb+srv://leeestephen:qb2Z42TWDYj34qZ@cluster0-w2ffd.mongodb.net/fbc_db?retryWrites=true";
var db = mongoose.connect(url,options);
