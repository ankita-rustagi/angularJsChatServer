var mongoose = require('./mongoose connection');

var chat = mongoose.Schema({
  from: String,
  to: String,
  chat: String,
  date: Date
});

module.exports = mongoose.model('chat',  chat);
