var mongoose = require("mongoose");
var options = {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};


var url = "mongodb+srv://csc301:csc301partner@cluster0-3vsmn.mongodb.net/test?retryWrites=true";
var db = mongoose.connect(url,options);