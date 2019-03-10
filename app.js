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
const Canvas = mongoose.model('Canvas');
mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('files'));
app.use('/static', express.static('public'));

const fal = 'false';
const denied = 'denied';
const tru = 'true';
const newReg = 1;
const regUser = 2;
const manager = 3;
const admin = 4;
const registrationRquest = new Array();
const canvasCount = 0;


// render login page
app.get('/login', function(req, res) {
  res.render('login');
});

// render canvas page
app.get('/canvas', function(req, res){
	res.render('canvas', {name:req.cookies.name, email:req.cookies.email});
});

// render manager page
app.get('/manager', function(req, res){
	res.render('manager', {name:req.cookies.name, email:req.cookies.email});
});

// render user page
app.get('/user', function(req, res){
	res.render('user', {name:req.cookies.name, email:req.cookies.email});
});

// render profile page
app.get('/profile', function(req, res){
	res.render('profile', {name:req.cookies.name, email:req.cookies.email});
});

// render password page
app.get('/password', function(req, res){
	res.render('password', {name:req.cookies.name, email:req.cookies.email});
});




app.post('/login', function(req, res) {
  var email = req.body.email;
  var pwd = req.body.pwd;
  var name;
  User.find({'email': email,'status': 2},function(err, result) {
      if (err) {
        console.log(err);
        res.send(0);
      } else if (result.length === 0) {
        console.log('user does not exist or does not have the authorization to login!');
        res.send(denied);
      } else {
        var user = result[0];
        name = user.name;
        if (pwd === user.pwd) {
        	console.log(name);
        	console.log(email);
          res.cookie('name', name);
          res.cookie('email', email);
          console.log("login finish");
          res.send("2");
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
  User.findOneAndUpdate({'email':email,'pwd':'','status':2},{name:name, pwd:pwd},function(err, result) {
      if (err) {
        console.log(err);
        res.send(0);
      } else if (result === null) {
        User.find({email: email},function(err, registered) {
            if (err) {
              console.log(err);
              res.send(0);
            } else if (registered.length !== 0) {
              console.log('The email has been registered in the system!');
              res.send(fal);
            } else {
              registrationRquest.push(email);
              var user = new User({
                name: name,
                email: email,
                pwd: pwd,
                role: newReg,
                canvas: canvasList,
                occupation: '',
                status: 1,
                phone: '',
                company: ''
              });
              User.create(user, function(err, newlyCreated) {
                if (err) {
                  console.log(err);
                } else {
                  res.cookie('name', name);    //cookie now store both name and email
                  res.cookie('email', email);
                  res.send(tru);
                }
              });
            }
          }
        );
      } else {
        res.send(result.role);
      }
    }
  );
});


// get canvas at the beginning
app.get('/canvas/get', function(req, res){
	
});


// get canvas from library page
app.get('/library/get', function(req, res){
	var email = req.cookies.name;
	User.find({'email':email}, function(err, result){
		if (err) {
			console.log(err);		
		} else {
			var user = result[0];
			var c_list = user.canvas;
			
			// loop through all canvas list
			var title = new Array();
			var canvasId = new Array();
			var users = new Array();
			for (var i = 0; i < c_list.length; i++){
				var t = c_list[i].title;
				var id = c_list[i].id;
				var user = c_list.users;
				title.push(t);
				canvasId.push(id);
				users.push(user);				
			}
			
			// send back to front end
			res.send({title:title, canvas:canvasId, users:users});
		}
	});
});


// edit user in manage page
app.post('/manager/user', function(req, res){
	 var type = req.body.type;
	 var id = req.body.canvasId;
	 var email = req.cookies.email;
	 Canvas.find({'id':id}, function(err, result){
	 	if (err) {
			console.log(err);	 	
	 	} else {
			if (type == "add"){
				//check if user is in the db
				User.find({'email':email}, function(err, result){
					if (err){
						console.log(err);					
					} else if (result.length == 0){
						//user not in the db	
						var canvasList = new Array();
						var user = new User({
                		name: '',
                		email: email,
                		pwd: '',
                		role: regReg,
                		canvas: canvasList,
                		occupation: '',
                		status: 2,
                		phone: '',
                		company: ''
              		});	
              		User.create(user, function(err, result) {
               		if (err) {
                  		console.log(err);
                  		res.send(fal);
                		} else {
                  		res.send(tru);  // send true when finish create user in db.
                		}
              		});		
					} else {
						//user in db
						Canvas.findOneAndUpdate({id:id}, {$push: {users:email}}, function(err, result){
							if (err) {
								console.log(err);	
								res.send(fal);						
							} else {
								res.send(tru);	 // send true when add user into canvas's user list.						
							}					
						});
					}
				});
			} else if (type == "remove"){
				// assume user is already in the db
				Canvas.findOneAndUpdate({id:id}, {$pull: {users:email}}, function(err, result){
					if (err) {
						console.log(err);	
						res.send(fal);						
					} else {
						res.send(tru);	 // send true when remove user from canvas's user list.						
					}					
				});
			}	 	
	 	}
	 });
});


// add canvas from manager page
app.post('/manager/add', function(req, res){
	var owner = req.body.owner;
	var title = req.body.title;
	var empty = new Array();
	var time = new Date();
	
	// create a new canvas with given owner and title.
	var canvas = new Canvas({
		id: canvasCount,
		owner: owner,
		title: title,
		users: empty,
		stickies: empty,
		createDate: time,
		editHistory: empty
	});
	
	// add canvas to database
	Canvas.create(canvas, function(err, result){
		if (err) {
			console.log(err);
			res.send(fal);		
		} else {
			canvasCount += 1;  // update global count number.
			res.send(tru);
		}
	});
});


// delete canvas from manager page
app.delete('/manager/del', function(req, res){
	var id = req.body.canvasId;
	Canvas.findOneAndDelete({id:id}, function(err, result){
		if (err) {
			console.log(err);	
			res.send(fal);	
		} else {
			var u = result.users;
			var s = result.stickies;
			var e = result.editHistory;
			
			// loop through to delete canvasId from users
			u.forEach(function(email){
				User.findOneAndUpdate({email:email}, {$pull: {cavas:id}}, function(err, result){
					if (err) {
						console.log(err);
						res.send(fal);					
					} 
				});
			});
			
			// loop through to delete stickies
			s.foreach(function(sid){
				Sticky.findOneAndDelete({id:sid}, function(err, result){
					if (err) {
						console.log(err);	
						res.send(fal);				
					}
				});
			});
			
			// loop through to delete editHistory
			e.foreach(function(eid){
				History.findOneAndDelete({id:eid}, function(err, result){
					if (err) {
						console.log(err);
						res.send(fal);					
					}
				});
			});
			
			// delete everything
			res.send(tru);		
		}		
	});
});


// get user information for profile page
app.get('/profile/get', function(req, res){
	var email = req.cookies.email;
	User.find({email:email}, function(err, result){
		if (err) {
			console.log(err);
			res.send(fal);		
		} else {
			var user = result[0];
			res.send({phone:user.phone, company:user.company, occupation:user.occupation});		
		}
	});
});


// edit user information for profile page
app.post('/profile/edit', function(req, res){
	var n = req.body.name;
	var p = req.body.phone;
	var c = req.body.company;
	var o = req.body.occupation;
	var e = req.cookies.email;
	
	User.findOneAndUpdate({email:e}, {$set: {name:n, phone:p, company:c, occupation:o}}, function(err, result){
		if (err) {
			console.log(err);
			res.send(fal);		
		} else {
			res.send(tru);		
		}
	});
});


// get password for password page
app.get('/pwd/get', function(req, res){
	var email = req.cookies.email;
	User.find({email:email}, function(err, result){
		if (err) {
			console.log(err);
			res.send(fal);		
		} else {
			var user = result[0];
			res.send({pwd:user.pwd});
		}
	});
});


// change password for password page
app.post('/pwd/edit', function(req, res){
	var pwd = req.body.pwd;
	var email = req.cookies.email;
	User.findOneAndUpdate({email:email}, {pwd:pwd}, function(err, result){
		if (err) {
			console.log(err);
			res.send(fal);		
		} else {
			res.send(tru);		
		}
	});
});


// get user information from 
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
