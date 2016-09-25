
    module.exports = function(io) {
        var express = require('express');
        var path = require('path');
        var router = express.Router();
        // var numUsers = 0;

        router.get('/', function(req, res, next) {
          res.sendFile(path.resolve('public/html/home.html'));
        });

        io.on('connection', function(socket) {
          // var addedUser = false;
          socket.on('chat message', function(msg){
             io.emit('chat message', msg);
            console.log('message: ' + msg);
          });

          // socket.on('add user',function(userName){
          //   if(addedUser)return;
          //   else{
          //     socket.userName=userName;
          //     numUsers++;
          //     addedUser=true;
          //     socket.emit('login',{
          //       numUsers : numUsers
          //     });
          //   }
          // });
        });

        return router;
    }
