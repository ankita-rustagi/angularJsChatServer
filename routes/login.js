var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var user = require('../models/userSchema');
var jwt =require('jwt-simple');

// GET login listing
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/login.html'));
  });

//POST login listing
router.post('/', function(req, res){
    console.log(req.body.uname);
    //Find in mongo if this user exist
    user.findOne({'name':req.body.uname},function(err,userInfo){
      if(err){
        return console.error(err);
      }
      //If user exist creating token
      if(userInfo){
        console.log('hello');
      //Payload is encode(encrypt) with secret key
        payload = {'user': req.body.uname};

        //jwt-simple or jsonwebtoken module can be used to create token
        var token = jwt.encode(payload,'abcd1234!@#qwe#$$'); //if jsonwebtoken
      //var token = jwt.encode(payload,'abcd1234!@#qwe#$$'); //if jwt-simple
        res.send(token);
      }
      else{
        console.log("Incorrect info");
        res.send(req.body.uname);
      }
    })
});

module.exports = router;
