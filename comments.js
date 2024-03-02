// create web server
var express = require('express');
// create express application
var app = express();
// create web server
var server = require('http').createServer(app);
// create socket.io server
var io = require('socket.io')(server);
// create comments array
var comments = [];
// create comments array
var users = [];
// create array of colors
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
// create express application
app.use(express.static('public'));
// create web server
server.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
// create web server
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
// create socket.io server
io.on('connection', function(client) {
  console.log('Client connected...');
  // create on message event
  client.on('message', function(data) {
    var nickname;
    // create on join event
    if (data.type == 'join') {
      nickname = data.message;
      users.push(nickname);
      client.nickname = nickname;
      var color = colors.shift();
      client.color = color;
      colors.push(color);
      client.emit('message', {
        type: 'color',
        message: color
      });
      client.broadcast.emit('message', {
        type: 'join',
        message: nickname
      });
      client.emit('message', {
        type: 'message',
        message: 'Welcome, ' + nickname + '!'
      });
    }
    // create on comment event
    if (data.type == 'comment') {
      var comment = {
        nickname: client.nickname,
        color: client.color,
        message: data.message
      };
      comments.push(comment);
      io.emit('message', {
        type: 'comment',
        message: comment
      });
    }
  });
  // create on disconnect event
  client.on('disconnect', function() {
    console.log('Client disconnected...');
    var index = users.indexOf(client.nickname);
    if (index > -1) {
      users.splice(index, 1);
    }
    client.broadcast.emit('message', {
      type: 'leave',
      message: client.nickname
    });
  });
});
// create on comments event
app.get('/comments', function(req, res) {
  res.send(comments);
}); // Add a closing curly brace here
