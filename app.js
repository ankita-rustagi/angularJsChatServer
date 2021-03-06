var express = require('express');
var socket_io = require( 'socket.io' );
var ss = require('socket.io-stream');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var io = socket_io();
var JwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var opts =  {};

opts.jwtFromRequest = extractJwt.fromAuthHeader();
opts.secretOrKey = 'abcd1234!@#qwe#$$';

app.io = io;

var people={};
var socketObj={};
var user=require('./models/userSchema');
var chat=require('./models/chatSchema');
var jwt =require('jsonwebtoken');

//Mongoose connection
mongoose.connect('mongodb://localhost/chating');
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));
db.once('open',function(){
  console.log('mongoose connected');
});


// view engine setup
// app.engine('html',require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, '/public')));


// Passport configuration
passport.use(new JwtStrategy(opts, function(payload, done) {
    user.findOne({'name': payload.user}, function(err, data) {
      console.log("payload: "+payload.user);
      console.log(user);
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));



var chatPage = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signUp = require('./routes/signUp');
var newChat;


//Main page
app.use('/chat',chatPage);
app.use('/users', users);
app.use('/login',login);
app.use('/signUp', signUp);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Socket connection established
io.on('connection',function(socket){

  ss(socket).on('file',function(stream,data){
  var filename=path.basename(data.name);
  console.log("path resolve: "+path.resolve(__dirname) );
  console.log("file name: "+data.name);
  console.log("file size: "+data.size);

  fs.exists(__dirname+"/filename",function(existFile){
    if(existFile){
      console.log("file already exist");
    }
    else{
      console.log("file not exist");
      stream.pipe(fs.createWriteStream('public/images/'+filename));
    }
  });
  });

  //User name and socket get stored in people and socketObj respectively.
  socket.on('joined',function(name){
    people[socket.id]=name;
    socketObj[socket.id]=socket;
    io.emit('online',people,socket.id);
  });

  //Send request to other online use
  socket.on('send request',function(id){
    socketObj[id].emit('chat request',people,socket.id);
  });

  //Sending response to sender that his request for chatting has been rejected
  socket.on('rejected',function(sId){
    socketObj[sId].emit('request rejected', people[socket.id]);
  });

  //Sending response to user who send request for chat that request is accepted by reciver
  socket.on('accepted',function(sId){ //sId is the id of sender who send request for chatting
    socketObj[sId].emit('request accepted', people[socket.id],socket.id);
    chat.findOne({
      conversationId: {
        $in: [people[sId] + '-' + people[socket.id], people[socket.id] + '-' + people[sId]]
      }
    },function(err,data){
      if(data){
        console.log("already exist");
      }else{
        newChat = new chat({
          conversationId: people[sId] + '-' + people[socket.id],
          user1: people[sId],
          user2: people[socket.id]
        });

        newChat.save(function(error, data) {
          console.log('chat saved');
        });
      }

    });
  });
  //Socket on dissconnection
  socket.on('disconnect', function(){
    delete people[socket.id];
    io.emit('online',people,socket.id);
  });

  //Sending messages to other online user
  socket.on('chat message', function(msg,rId){
    socketObj[rId].emit('chat message rec',  people[socket.id], msg,socket.id);
    socket.emit('chat message self',  people[socket.id], msg,rId);
    //Find conversationId
    chat.findOne({
      conversationId: {
        //$in will return document if matches
        $in: [people[rId] + '-' + people[socket.id], people[socket.id] + '-' + people[rId]]
      }
    },function(err,data){
      console.log("sender: "+ people[rId]);
      console.log("message: "+ msg);
      //pushing senderName and message in chatHistory
      data.chatHistory.push({
        sender: people[socket.id],
        message: msg

      });
      //update data in json
      data.save(function() {
        console.log('chat updated');
      });
    });
  });

  socket.on("file upload complete",function(rId,fName,fSize){
    var filePath=__dirname+"/"+fName;
    socketObj[rId].emit('chat file rec',  people[socket.id],fName,socket.id);
    socket.emit('chat file self',  people[socket.id], fName,rId);
  });
});


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
