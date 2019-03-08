var mongoose = require("mongoose");
var options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true
};


var url = "mongodb+srv://csc301:csc301partner@cluster0-3vsmn.mongodb.net/test?retryWrites=true";
var db = mongoose.connect(url,options);