  var express = require('express');
  var router = express.Router();
  var path = require('path');
  var user = require('../models/userSchema');

  /* On get request. */
  router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/signUp.html'));
  });

  /* On post request. */
  router.post('/', function(req, res) {
    var userEmail = req.body.remail;
    var userName = req.body.rname;
    var userPassword = req.body.rpwd;
    var userPhone = req.body.rph;
    var u=new user({'name': userName, 'password': userPassword, 'email': userEmail, 'phone':userPhone});
      u.save(function (err, data) {
      if (err) return console.error(err);
      console.log("updation successfull");
      console.log('return ho gaya');
      res.send('hi');
      });
  });


  module.exports = router;
