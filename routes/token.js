var express = require('express');
var router = express.Router();
var path = require('path');
var user = require('../models/userSchema');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jwt-simple');
var token = extractJwt.fromHeader("tokenName");
var params = {
  secretOrKey: 'abcd1234!@#qwe#$$',
  jwtFromRequest: token
};



router.all('/', function(req,resp){
  console.log('token: '+token);
  // console.log('payload: '+ payload);
  res.send('api ');
  // var strategy = new jwtStrategy(params, function(payload, done) {
  //   var user = users[payload.id] || null;
  //   if (user) {
  //     return done(null, {id: user.id});
  //   } else {
  //     return done(new Error("User not found"), null);
  //   }
  // });
  // passport.use(strategy);
  // return {
  //   initialize: function() {
  //     return passport.initialize();
  //   },
  //   authenticate: function() {
  //     return passport.authenticate("jwt", cfg.jwtSession);
  //   }
  // };
});
module.exports = router;
