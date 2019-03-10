// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('canvas');
});

app.get('/canvas/get', function(req, res) {
    res.send({
        canvasId: 1,
        owner: 'Andrew',
        title: 'Example',
        createDate: new Date(),
        stickies: [{
            id: 1,
            content: "hello",
            position: {
                left: 500,
                top: 500
            },
            size: {
                width: 150,
                height: 150
            },
            color: 'rgb(123,21,123)',
            title: '',
            comment: []
        }]
    });
});

app.post('/canvas/edit', function(req, res) {
    res.send(true)
})

app.listen(8080);
console.log('8080 is the magic port');

app.get('/manager', function(req, res) {
    res.render('pages/manager')
})