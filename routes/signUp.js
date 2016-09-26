var userConnected=0;
module.exports = function(io){
  var express = require('express');
  var router = express.Router();
  var path = require('path');
  var user = require('../models/userSchema');

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/signUp.html'));
  });

  router.post('/', function(req, res) {
    var userEmail = req.body.remail;
    var userName = req.body.rname;
    var userPassword = req.body.rpwd;
    user.findOne({ 'email': userEmail}, 'name id', function (err, data) {
    if (err) return console.error(err);
    console.log("data: "+data);
    if(data == null || data == ""){
      var u=new user({'name': userName, 'password': userPassword, 'email': userEmail});
      u.save(function (err, data) {
      if (err) return console.error(err);
      console.log("updation successfull");
      io.emit('registration successfull',userName);
      console.log('return ho gaya');
      res.redirect('/login');
      });

    }
    else{
      console.log("enter in else condition");
        io.emit('already exist', userEmail);
    }
  });
  });

  return router;
};
