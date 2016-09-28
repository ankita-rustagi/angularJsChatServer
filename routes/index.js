// var numUser=0;
var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/',passport.authenticate('jwt', { session: false}) ,function(req, res, next) {
  console.log(res);
  res.sendFile(path.resolve('public/html/home.html'));
});

module.exports = router;




// module.exports = function() {
//   var express = require('express');
//   var path = require('path');
//   var router = express.Router();
//   //---------------------------------------------------
//   router.get('/', function(req, res, next) {
//     res.sendFile(path.resolve('public/html/home.html'));
//   });
//   return router;
// }

  // var mongoose=require('mongoose');
  // mongoose.connect('mongodb://localhost/test');
  // var db=mongoose.connection;
  // db.on('error',console.error.bind(console,'connection error: '));
  // db.once('open',function(){
  //   console.log('mongoose connected');
  // });
  // var userSchema = mongoose.Schema({
  //   name: String,
  //   password: String,
  //   email: String
  // });
  // console.log('initial user: '+numUser);
  // var chatSchema = mongoose.Schema({
  //   from: String,
  //   to: String,
  //   date: Date,
  //   message: String
  // });
  // var user=mongoose.model('user', userSchema);
  // var chat=mongoose.model('chat',chatSchema);
  // var people={};
  //
  //
  //
  // io.on('connection', function(socket) {
  //
  //   socket.on('joined', function(name){
  //
  //     people[socket.id]=name;
  //     numUser++;
  //     console.log("number of user is: "+numUser);
  //     var userName = new user({ name: name, id: socket.id });
  //     userName.save(function (err, data) {
  //       if (err)
  //       return console.error(err);
  //     });
  //     console.log("Server side user added");
  //     io.emit('user added',numUser, people[socket.id]);
  //   });
  //
  //   socket.on('chat message', function(msg){
  //     var userChat=new chat({from: people[socket.id], date: Date.now(), message: msg});
  //     userChat.save(function (err, data) {
  //       if (err)
  //       return console.error(err);
  //     });
  //     io.emit('chat message',  people[socket.id], msg);
  //   });
  //
  //   socket.on('disconnect', function(){
  //     numUser--;
  //     io.emit('user disconnect', numUser , people[socket.id]);
  //     delete people[socket.id];
  //     console.log('user disconnected');
  //   });
  //
  // });
