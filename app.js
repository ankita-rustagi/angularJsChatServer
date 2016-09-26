var express = require('express');
var socket_io = require( "socket.io" );
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var io = socket_io();
app.io = io;

var people={};
var socketObj={};

// mongoose.connect('mongodb://localhost/chating');
// var db=mongoose.connection;
// db.on('error',console.error.bind(console,'connection error: '));
// db.once('open',function(){
//   console.log('mongoose connected');
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, '/public')));

var chat = require('./routes/index');
var users = require('./routes/users');
// var signUp = require('./routes/signUp')(io);


app.use('/chat',chat);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

io.on('connection',function(socket){
  socket.on('joined',function(name){
    people[socket.id]=name;
    io.emit('online',people);
  })


});

//
// io.on('connection', function(socket) {
//
//   socket.on('joined', function(name){
//      people[socket.id]=name;
//       io.emit('online user', people);
//       console.log('io emit');
//       var id = Object.keys(people);
//       console.log(id);
//   });
// });

//   socket.on('chat message', function(msg){
//     // var userChat=new chat({from: people[socket.id], date: Date.now(), message: msg});
//     // userChat.save(function (err, data) {
//     //   if (err)
//     //   return console.error(err);
//     // });
//     io.emit('chat message',  people[socket.id], msg);
//   });
//
//   // socket.on('disconnect', function(){
//   //   io.emit('user disconnect', people[socket.id]);
//   //   delete people[socket.id];
//   //   console.log('user disconnected');
//   // });
//


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
