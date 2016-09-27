var mongoose=require('mongoose');
//Creating schema for user
var userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  phone: Number
});
console.log("user schema created");
module.exports = mongoose.model('user', userSchema);
