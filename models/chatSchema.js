var mongoose = require('mongoose');
// Creating Schema for chat
var chat = mongoose.Schema({
  conversationId: String,
  user1: String,
  user2: String,
  chatHistory: [{
    sender: String,
    message: String
  }]
});
console.log("chatSchema created");
module.exports = mongoose.model('chat',  chat);
