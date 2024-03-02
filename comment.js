// create web server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var jsonPath = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// get all comments
app.get('/comments', function(req, res) {
  fs.readFile(jsonPath, function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// add a comment
app.post('/comments', function(req, res) {
  fs.readFile(jsonPath, function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(jsonPath, JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(comments));
    });
  });
});

// start server
app.listen(3000, function() {
  console.log('Server is running on port 3000');
});