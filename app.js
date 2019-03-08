var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var http = require('http');

require('./connect.js');
require('./models/canvas.js');
require('./models/comment.js');
require('./models/history.js');
require('./models/sticky.js');
require('./models/user.js');

//model name
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');
const History = mongoose.model('History');
const Sticky = mongoose.model('Sticky');
const canvas = mongoose.model('Canvas');
mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('files'));
app.use('/static', express.static('public'));

const fal = 'false';
const tru = 'true';

//login page

app.get('/login', function(req, res) {
    res.render('login');
  })
  
  app.post('/login',function (req, res) {
      var email = req.body.email;
      var pwd = req.body.pwd;
      var name;
      User.find({'email': email}, function(err, result){
        if (err) {
          console.log(err);
          res.send(fal);
        } else if (result.length === 0) {
          console.log('user does not exist!');
          res.send(fal);
        } else {
          var user = result[0];
          name = user.name;
          if (pwd === user.pwd) {
            res.cookie('name',name);
            res.send(tru);
          } else {
            res.send(fal);
          }
        }
      })
  
  })

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
