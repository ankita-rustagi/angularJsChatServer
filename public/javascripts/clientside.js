var socket = io();
socket.on('not exist',function(email){
  alert(email+ " does not exist");
  $('#email').val('');
  $('#pwd').val('');
  return;
});
socket.on('wrong password',function(){
  alert("Incorrect Password");
  $('#email').val('');
  $('#pwd').val('');
  return;
});
socket.on('already exist',function(email){
  alert(email+ " already exist");
  $('#rname').val('');
  $('#remail').val('');
  $('#rpwd').val('');
  return;
});
socket.on('registration successfull',function(name){
  alert("Welcome "+ name );
  return;
});
