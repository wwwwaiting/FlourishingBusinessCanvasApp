var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./connect.js');
require('./models/canvas.js');
require('./models/sticky.js');
require('./models/user.js');

//model name
const User = mongoose.model('User');
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


// socket.io settings
io.on("connection", (socket) => {
  console.log("Socket connection is established.")
  socket.on('stickyUpdateSize', function(data) {
    socket.broadcast.emit('stickyUpdateSize', data);
  });
  socket.on('stickyUpdatePos', function(data) {
    socket.broadcast.emit('stickyUpdatePos', data);
  });
  socket.on('stickyAdd', function(data) {
    socket.broadcast.emit('stickyAdd', data);
  });
  socket.on('stickyUpdateComment', function(data) {
    socket.broadcast.emit('stickyUpdateComment', data);
  });
  socket.on('stickyUpdateColor', function(data) {
    socket.broadcast.emit('stickyUpdateColor', data);
  });
  socket.on('stickyDelete', function(data) {
    socket.broadcast.emit('stickyDelete', data);
  });
  socket.on('stickyUpdateContent', function(data) {
    socket.broadcast.emit('stickyUpdateContent', data);
  });
  socket.on('disconnect', function() {
    console.log("Socket has disconnected");
  });
})


const fal = 'false';
const denied = 'denied';
const tru = 'true';
const newReg = 1;
const regUser = 2;
const manager = 3;
const admin = 4;

const registrationRquest = new Array();
const changeType = ['content', 'position', 'size', 'color', 'comment'];

// render login page
app.get('/login', function(req, res) {
  res.clearCookie('id');
  res.clearCookie('email');
  res.clearCookie('name');
  res.render('login');
});

// render canvas page
app.get('/canvas', function(req, res){
	res.render('canvas', {name:req.cookies.name, email:req.cookies.email, id:req.cookies.id});
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



// user login request
app.post('/login', function(req, res) {
  var email = req.body.email;
  var pwd = req.body.pwd;
  var name;
  // need to find the user with requested email in 'approved' status
  User.find({'email': email,'status': 2},function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      } else if (result.length === 0) {
        console.log('user does not exist or does not have the authorization to login!');
        res.send(denied);
      } else {
        var user = result[0];
        name = user.name;
        role = user.role;
        // if the user existed, compare incoming password with the passward in the database
        if (pwd === user.pwd) {
          // user cookie for future usage
          res.cookie('name', name);
          res.cookie('email', email);
          res.send(role.toString());
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

  // the initial status of an approved user does not have password
  // the functionality of register is actually updating the user name and password
  User.findOneAndUpdate({'email':email,'pwd':'','status':2},{name:name, pwd:pwd},function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      // if there is no user in initial status it can be multiple situations
      // it can be an outside using is trying to login to this website
      // or an outside user is signing up more than once
      // or the password has been updated, so there is no need to signup again
      else if (result === null) {
        User.find({email: email},function(err, registered) {
            if (err) {
              console.log(err);
              res.send(err);
            } else if (registered.length !== 0) {
              console.log('The email has been registered in the system!');
              res.send(fal);
            } else {
              // only when an outside user trying to signup at the first time, then create new user
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
                  res.send(err);
                } else if (newlyCreated == null){
                  res.send(err);
                } else {
                	//console.log(newlyCreated.id);
                  res.send(newReg.toString());
                }
              });
            }
          }
        );
      } else {
        res.cookie('name', name);    //cookie now store both name and email
        res.cookie('email', email);
        var resp = result.role;
        res.send(resp.toString());
      }
    }
  );
});



// get canvas at the beginning
app.get('/canvas/get', function(req, res){
  var canvasId = req.cookies.id;
  var stickyList = [];
  Canvas.find({_id: canvasId},function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    } else if (result.length !== 0) {
      var canvas = result[0];
      var result = {
        'canvasId': canvasId,
        'owner':canvas.owner,
        'title':canvas.title,
        'createDate': canvas.createDate
      };
      // constract the sticky list that the result need
      var stickies = canvas.stickies; // list of sticky ID, use each of the id to find the actual Sticky
      let count = 1;
      if (stickies.length == 0) {
        result.stickies = stickyList;
        res.send(result);
      }else{
        for (i = 0; i < stickies.length; i++){
        let ID = stickies[i];
        Sticky.find({_id: ID},function(err, sti) {
          if (err) {
            console.log(err);
            res.send(err);
          } else if (sti.length !== 0) {
            var sticky = sti[0];
            stickyList.push(sticky);
            if (count === stickies.length){
              result.stickies = stickyList;
              res.send(result);
            }
            count ++;
          }
        });
      }
      }
    }
  });
});

app.post('/canvas/add', function(req, res){
  var canvas =  req.body.canvasId;
  var sticky = req.body.sticky;
  var re = {};
  re.status = fal;
  Canvas.find({_id:canvas}, function(err, result){
    if(err){
      console.log(err);
      res.send(re);
    } else if (result.length == 0){
      res.send(re);
    } else {
      // create new sticky

      sticky.canvasId = canvas;
      sticky.modifiedTime = new Date()
      var newStic = new Sticky(sticky)
      Sticky.create(newStic, function(err, newlyCreated) {
        if (err) {
          console.log(err);
          res.send(re);
        }else if ( newlyCreated == null){
          res.send(re);
        }
        else {
          // add sticky index to the canava
          var newHistory = {
            stickyID: newlyCreated._id,
            user: req.cookies.email,
            content: 'Add new sticky',
            modifiedTime: new Date()
          };
          Canvas.findOneAndUpdate( {_id:canvas},
            { $push: { stickies : newlyCreated._id, editHistory : newHistory } },
            function(err, updated){
              if (err) {
                console.log(err);
                res.send(re);
              } else if (updated == null){
                re.status = fal;
                res.send(re);
              } else{
                re.status = tru;
                re.id = newlyCreated._id;
                res.send(re);
              };
          });
        }
      });
    }
  });
});

app.delete('/canvas/delete', function(req, res){
  var canvas = req.body.canvasId;
  var sticky = req.body.stickyId;
  var newHistory = {
    stickyID: sticky,
    user: req.cookies.email,
    content: 'Delete sticky',
    modifiedTime: new Date()
  };
  Canvas.findOneAndUpdate({_id: canvas}, {
      $pull: { stickies: sticky }, // delete sticky id from the sticky list in canvas
      $push: { editHistory: newHistory } // add new history to the canvas
    }, function (err, result) {
      if (err) {
        console.log(err);
        res.send(fal);
      } else if (result == null) {
        res.send(fal);
      } else {
        // delete the canvas by the requested id
        Sticky.findOneAndDelete({_id:sticky}, function(err, deleted){
          if (err) {
            console.log(err);
            res.send(fal);
          } else if (deleted == null){
            res.send(fal);
          } else{
            res.send(tru);
          };
        });
      };
    });
});

app.post('/canvas/edit', function(req, res){
  var canvas = req.body.canvasId;
  var sticky = req.body.stickyId;
  var type = req.body.type;
  var change = req.body.change;
  var newHis = {
    user: req.cookies.email,
    content: 'Modified' + type,
    modifiedTime: new Date()
  };
  if (changeType.indexOf(type) !== -1){
    if (type === 'comment'){
      // create new comment
      var newCom = {
        stickyID: sticky,
        user: req.cookies.email,
        content: change,
        modifiedTime: new Date()
      };
      // add new comment to the corresponding sticky
      Sticky.findOneAndUpdate({_id:sticky}, { $push: { comment : newCom } }, function(err, result){
        if (err) {
          console.log(err);
          res.send(fal);
        } else if (result == null){
          res.send(fal);
        }else{
          Canvas.findOneAndUpdate({_id:canvas}, { $push: { editHistory : newHis }}, function(err, updated){
            if (err) {
              console.log(err);
              res.send(fal);
            } else if (result == null){
              res.send(fal);
            } else{
              res.send(tru);
            }
          });
        };
      });
    }
    else{
      // update sticky information only
      Sticky.findOneAndUpdate({_id:sticky}, {[type]:change, modifiedTime:new Date()},function(err, result){
        if (err) {
          console.log(err);
          res.send(fal);
        } else if (result == null){
          res.send(fal);
        }else{
          Canvas.findOneAndUpdate({_id:canvas}, { $push: { editHistory : newHis }}, function(err, updated){
            if (err) {
              console.log(err);
              res.send(fal);
            } else if (result == null){
              res.send(fal);
            } else{
              res.send(tru);
            }
          });

        }
      });
    }
  }
});

// get role of current user
app.get('/canvas/role', function(req, res){
  var email = req.cookies.email;
  User.find({'email':email}, function(err, result){
    if (err){
      console.log(err);
    } else {
      var user = result[0];
      res.send({role:user.role});
    }
  });
});

// get canvas from library page
app.get('/library/get', function(req, res){
	res.clearCookie('id');
	var email = req.cookies.email;
	User.find({'email':email}, function(err, result){
		if (err) {
			console.log(err);
		} else {
			var user = result[0];
			var c_list = user.canvas;
			console.log(c_list)

			var title = new Array();
			var canvasId = new Array();
			var users = new Array();
			if (c_list.length != 0) {
				let count = 1;
				// loop through all canvas list
				for (let i = 0; i < c_list.length; i++){
					Canvas.find({_id:c_list[i]}, function(err, result){
						if (err) {
							console.log(err);
						} else {
							var c = result[0];
							var id = c.id
							var t = c.title;
							var user = c.users;
							canvasId.push(id);
							title.push(t);
							users.push(user);
							if (count == c_list.length){
								res.send({title:title, canvas:canvasId, users:users});
							}
							count ++;
						}
					});
				}
			}
		}
	});
});


// store the canvas id into cookie
app.post('/library/id', function(req, res){
	var canvasId = req.body.canvasId;
	console.log(canvasId);
	res.cookie('id', canvasId);
	res.send(tru);
});


// edit user in manage page
app.post('/manager/user', function(req, res){
	 var type = req.body.type;
	 var id = req.body.canvasId;
	 var emails = req.body.email;   // now is a list of email
	 Canvas.find({'id':id}, function(err, result){
	 	if (err) {
			console.log(err);
	 	} else {
			if (type == "add"){
				emails.forEach(function(email){
					//check if user is in the db
					User.find({'email':email}, function(err, result){
						if (err){
							console.log(err);
						} else if (result.length == 0){
							//user not in the db
							console.log("not in db")
							var canvasList = new Array();
							var user = new User({
                			name: '',
                			email: email,
                			pwd: '',
                			role: regUser,
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
                				Canvas.findOneAndUpdate({_id:id}, {$push:{users:email}}, function(err, result){
                					if (err) {
											console.log(err);
                					}
                				});
                  			res.send(tru);  // send true when finish create user in db.
                			}
              			});
						} else {
							//user in db
							console.log("in db");
							Canvas.findOneAndUpdate({_id:id}, {$push: {users:email}}, function(err, result){
								if (err) {
									console.log(err);
									res.send(fal);
								} else {
									User.findOneAndUpdate({email:email}, {$push:{canvas:id}}, function(err, result){});
									res.send(tru);	 // send true when add user into canvas's user list.
								}
							});
						}
					});
				});
			} else if (type == "remove"){
				// assume user is already in the db
				emails.forEach(function(email){
					Canvas.findOneAndUpdate({_id:id}, {$pull: {users:email}}, function(err, result){
						if (err) {
							console.log(err);
							res.send(fal);
						} else {
							res.send(tru);	 // send true when remove user from canvas's user list.
						}
					});
					User.findOneAndUpdate({email:email}, {$pull:{canvas:id}}, function(){
						if (err) {
							console.log(err)
						}
					});
				});
			}
	 	}
	 });
});


// add canvas from manager page
app.post('/manager/add', function(req, res){
	var owner = req.cookies.name;
	var email = req.cookies.email;
	var title = req.body.title;
	var empty = new Array();
	var time = new Date();

	// create a new canvas with given owner and title.
	var canvas = new Canvas({
		owner: owner,
    title: title,
    company:'',
		users: empty,
		stickies: empty,
		createDate: time,
		editHistory: empty
	});

	// add canvas to database
	Canvas.create(canvas, function(err, result){  //give back new canvas id.{id}
		if (err) {
			console.log(err);
		} else {
			User.findOneAndUpdate({email:email}, {$push:{canvas:result.id}}, function(err, result){
				if (err) {
					console.log(err);
				}
			});
			res.send({id:result.id});
		}
	});

});


// delete canvas from manager page
app.delete('/manager/del', function(req, res){
	var ids = req.body.canvasId;  //now is a list of canvasId
	var owner = req.cookies.email;
	ids.forEach(function(id){
		Canvas.findOneAndDelete({_id:id}, function(err, result){
			if (err) {
				console.log(err);
				res.send(fal);
			} else {
				var u = result.users;
				var s = result.stickies;


				User.findOneAndUpdate({email:owner}, {$pull:{canvas:id}}, function(err, result){});

				// loop through to delete canvasId from users
				u.forEach(function(email){
					User.findOneAndUpdate({email:email}, {$pull: {canvas:id}}, function(err, result){
						if (err) {
							console.log(err);
							res.send(fal);
						}
					});
				});

				// loop through to delete stickies
				s.forEach(function(sid){
					Sticky.findOneAndDelete({_id:sid}, function(err, result){
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
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
