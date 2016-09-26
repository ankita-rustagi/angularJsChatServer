var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));
db.once('open',function(){
  console.log('mongoose connected');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
