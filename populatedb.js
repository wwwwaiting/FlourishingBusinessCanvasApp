#! /usr/bin/env node

console.log('Usage: populatedb mongodb+srv://dbuser:password@cluster0-mbdj7.mongodb.net/mydb?retryWrites=true');
const regUser = 2;
const manager = 3;
const admin = 4;

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Canvas = require('./models/canvas')
var Sticky = require('./models/sticky')
var User = require('./models/user')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var canvases = []
var stickies = []
var users = []

function canvasCreate(canvasOwner, canvasEmail, canvasTitle, userList, cb) {
    const canvasDetail = {
        owner: canvasOwner,
        email: canvasEmail,
        title: canvasTitle,
        company:'',
        users: userList,  //email
        stickies: [],
        createDate: new Date(),
        editHistory: []  //history id
    }

    var newCanvas = new Canvas(canvasDetail);

    newCanvas.save(function (err, saved) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Canvas: ' + newCanvas);
        console.log('Saved as: ', saved);
        canvases.push(newCanvas)
        cb(null, newCanvas)
    });
}

function userCreate(userName, userEmail, userPassword, userRole, userCanvases, userOccupation, userStatus, userPhone, userCompany, cb) {
    const userDetail = {
        name: userName,
        email: userEmail,
        pwd: userPassword,
        role: userRole,
        canvas: userCanvases,
        occupation: userOccupation,
        status: userStatus,
        phone: userPhone,
        company: userCompany
    }

    var newUser = new User(userDetail);
    newUser.save(function (err, saved) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + newUser);
        console.log('Saved as: ', saved);
        users.push(newUser)
        cb(null, newUser)
    });
}


function createCanvases(cb) {
    async.series([
            function (callback) {
                canvasCreate('Patrick', 'userB@gmail.com', 'Patrick\'s Canvas', ['userA@gmail.com', 'userB@gmail.com'], callback);
            },
            function (callback) {
                canvasCreate('Ben', 'userB@gmail.com', 'Canvas for Ben', ['userB@gmail.com', 'userC@gmail.com'], callback);
            },
            function (callback) {
                canvasCreate('John', 'userD@gmail.com', 'Canvas for John', ['userD@gmail.com', 'userB@gmail.com'], callback);
            },
        ],
        // optional callback
        cb);
}


function createUsers(cb) {
    async.parallel([
            function (callback) {
                userCreate('userA\xa0Baril', 'userA@gmail.com', '123', regUser, ['Patrick\'s Canvas'], 'Student', 2, '416788888', 'UofT',callback);
            },
            function (callback) {
                userCreate('userB\xa0Meraji', 'userB@gmail.com', '123', manager, ['Patrick\'s Canvas', 'Canvas for Ben', 'Canvas for John'], 'Manager', 2, '4167777777', 'Company1',callback);
            },
            function (callback) {
                userCreate('userC\xa0Milway', 'userC@gmail.com', '123', regUser, ['Canvas for Ben'], 'Assistant', 2, '4166666666', 'Company1',callback);
            },
            function (callback) {
                userCreate('userD\xa0Bacchus', 'userD@gmail.com', '123', manager, ['Canvas for John'], 'Manager', 2, '', '',callback);////
            },
            function (callback) {
                userCreate('Andrew\xa0Simpson', 'andrew@ecotonesoftware.com', 'admin', admin, ['Patrick\'s Canvas', 'Canvas for Ben'], 'Administrator', 2, '', '', callback);
            },
        ],
        // optional callback
        cb);
}

async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }
}

function fixUserCanvasObjId(cb) {
    // console.log(canvases);
    console.log(users);
    async.eachSeries(users, function(user, callback){
        const canvasesObjId = [];
        user.canvas.forEach(c => {
            canvasesObjId.push(canvases.find(x => x.title == c)._id);
        })
        console.log('this user: ' + canvasesObjId)
        User.findByIdAndUpdate(user._id, { canvas: canvasesObjId }, callback);
    }, function(err){
        if (err) console.log('err: ', err);
        console.log('all done');
        cb()
    })
}

async.series([
        createCanvases,
        createUsers,
        fixUserCanvasObjId
    ],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Result: ' + results)
            console.log('Canvases: ' + canvases);
            console.log('Users: ' + users);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });