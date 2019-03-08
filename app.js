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
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('files'));
app.use('/static', express.static('public'));

const fal = 'false';
const denied = 'denied';
const tru = 'true';
const registrationRquest = new Array();

//login page

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var email = req.body.email;
  var pwd = req.body.pwd;
  var name;
  User.find(
    {
      email: email,
      status: 2,
    },
    function(err, result) {
      if (err) {
        console.log(err);
        res.send(fal);
      } else if (result.length === 0) {
        console.log('user does not exist or does not have the authorization to login!');
        res.send(denied);
      } else {
        var user = result[0];
        name = user.name;
        if (pwd === user.pwd) {
          res.cookie('name', name);
          res.send(tru);
        } else {
          res.send(fal);
        }
      }
    }
  );
});

// register for new user
app.post('/register', function(req, res) {
  var name = req.body.name;
  var pwd = req.body.pwd;
  var email = req.body.email;
  var canvasList = new Array();
  User.findOneAndUpdate(
    {
      email: email,
      pwd: '',
      status: 2,
    },
    {
      pwd: pwd,
    },
    function(err, result) {
      if (err) {
        console.log(err);
        res.send(fal);
      } else if (result === null) {
        User.find(
          {
            email: email,
          },
          function(err, result) {
            if (err) {
              console.log(err);
              res.send(fal);
            } else if (result.length !== 0) {
              console.log('The email has been registered in the system!');
              res.send(fal);
            } else {
              registrationRquest.push(email);
              var user = new User({
                name: name,
                email: email,
                pwd: pwd,
                role: 1,
                canvas: canvasList,
                occupation: '',
                status: 1,
              });
              User.create(user, function(err, newlyCreated) {
                if (err) {
                  console.log(err);
                } else {
                  res.cookie('name', name);
                  res.send(tru);
                }
              });
            }
          }
        );
      } else {
        res.send(tru);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
