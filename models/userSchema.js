var mongoose=require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String
});
console.log('schema created');
module.exports = mongoose.model('user', userSchema);
