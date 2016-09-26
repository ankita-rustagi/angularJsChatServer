module.exports = function(io){
  var express = require('express');
  var router = express.Router();
  var path = require('path');
  var user = require('../models/userSchema');
  people={};
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/login.html'));
  });

  router.post('/', function(req, res) {

    var userEmail = req.body.email;
    var userPassword = req.body.pwd;
    user.findOne({ 'email': userEmail }, 'name  password', function (err, data) {
    if (err) return console.error(err);
    console.log("data: "+data);
    if(data == null || data == ""){
      console.log("enter in if condition");
        io.emit('not exist', userEmail);
    }
    else{
      if(data.password == userPassword){
        io.on('connection',function(socket){
          console.log('successful');
          people[socket.id]['userEmail']=userEmail;
          people[socket.id]['userName']=userName;
          console.log(people);
          res.redirect('/chat');
        });
      }else{
        io.emit('wrong password');
      }
    }
  });
  });

  return router;
};