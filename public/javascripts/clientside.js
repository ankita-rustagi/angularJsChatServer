var socket = io();

$(document).ready(function(){

  $('#message').hide();
  $('.a').hide();
  $('.b').show();
  $('.c').hide();
});

// Submit username and emit 'joined' and passing username to server
$('#userBtn').click(function(){
  socket.emit('joined', $('#name').val());
});


//Fetching list of online users and displaying on screen
socket.on('online', function(people, myId){  //myId is the id of user who logged in.
  var id=Object.keys(people);
  $('.a').hide();
  $('.b').hide();
  $('.c').show();
  $('#onlineList').empty();
  for (var i = 0; i < id.length; i++) {
    $('#onlineList').append('<li class = "userOnline" name="'+people[id[i]]+'" id = "'+ id[i] +'" >'+people[id[i]]+'</li>');
    $ ('ul#onlineList li').addClass ('list-group-item list-group-item-success');
  }
});

//In the list of online user, click on a user name and  id of the selected user is send to server by emiting 'send request'
$(document).on('click','.userOnline',function(){
  var id=this.id;
  socket.emit('check if already connected',id);
  //id is the id of user selected from online user list for chat request(sender id)
  socket.emit('send request', id);
  console.log('request is sending........');
});

// Receiver receive a chat request from sender. Receiver either accept the request by clicking on accept button or reject the request by clicking on reject button
socket.on('chat request',function(people,senderId){
  $('#onlineList').append('<div id="chatRequest"> chat request from '+people[senderId]+' <div type="button" sId="'+senderId +'" id="accept"> Accept </div><div type="button" sId="'+senderId +'" id="reject"> Reject </div></div>');
});

//Receiver click on reject button.First we are fetching the id of sender and sending it to server by emiting 'rejected'
$(document).on('click','#reject',function(){
  var x=$(this).attr('sId');   //sId and x is the id of sender who send request for chat
  console.log('rejected click: x '+x);
  $('#chatRequest').remove();
  socket.emit('rejected',x);
});

//Receiver click on accept button. First we are fetching the id of sender and sending it to server by emiting 'accept'
$(document).on('click','#accept',function(){
  var x=$(this).attr('sId'); //sId and x is the id of sender who send request for chat
  $('#chatRequest').remove();
  var div=$('<div/>');
  tempx=x.replace("/","");
  tempx=tempx.replace("#","");
  //Dynamically created form in which id of input is m+idOfSender who send request for chat and id of button is the id of sender who send request for chat
  var form=$('<form id="messageForm"> <input type="text" id="m'+tempx+'"/><button type="button" class="sendBtn"  id = "'+ x+'" >Send</button></form>	<input id="file" type="file" />');
  //id of list is mess+idOfSender who send request for chat

  var li=$('<ul id= "mess'+tempx+'"></ul>');
  form.append(li);
  div.append(form);
  $('#chat').append(div);
  socket.emit('accepted',x); //x is the id of user who send request for chat
});

//Showing to sender that his requet has been rejected by receiver
socket.on('request rejected',function(name){
  $('#acceptedOrRejected').append('<div> '+ name+ ' rejected your request');
});

// Receiver send response to sender that your request has been accepted
socket.on('request accepted',function(name,rId){ //rId is the id of user who accept request for chatting
  $('#acceptedOrRejected').append('<div> '+ name+ ' accepted your request');
  temp=rId.replace("/","");
  temp=temp.replace("#","");
  var div=$('<div/>');
  var form=$('<form id="messageForm"> <input type="text" id="m'+temp+'"/><button type="button" class="sendBtn"  id = "'+ rId+'" >Send</button></form><input rId="'+rId+'" id="file" type="file" />');
  var li=$('<ul id= "mess'+temp+'"></ul>');
  form.append(li);
  div.append(form);
  $('#chat').append(div);
});

//Sending message to server by emiting 'chat message'.
$(document).on('click','.sendBtn',function(){
  var receiverId=this.id;
  var tempId=receiverId.replace("#","");
  tempId=tempId.replace("/","");
  socket.emit('chat message', $('#m'+tempId).val(),receiverId);
  $('#m'+tempId).val('');
  return false;
});

//showing message to itself
socket.on('chat message self', function(name,msg,id){
  var tempId=id.replace("/","");
  tempId=tempId.replace("#","");
  $('#mess'+tempId).append($('<li>').text(name+": "+msg));
});

//Sending message to other user
socket.on('chat message rec', function(name,msg,id){
  var tempId=id.replace("/","");
  tempId=tempId.replace("#","");
  $('#mess'+tempId).append($('<li>').text(name+": "+msg));
});

$(document).on('change','#file',function(event){
   var file = event.target.files[0];
   var stream = ss.createStream();
   var rId = $(this).attr("rId");
   ss(socket).emit('file',stream,{name:file.name, size:file.size});
   var blobStream = ss.createBlobReadStream(file);
   var size = 0;
   blobStream.on('data', function(chunk) {
     size += chunk.length;
     if((size/file.size) == 1)
     socket.emit("file upload complete",rId,file.name,file.size);
     console.log(Math.floor(size / file.size * 100));

   });
   blobStream.pipe(stream);
  // ss.createBlobReadStream(file).pipe(stream);
});

socket.on('chat file self', function(name,fPath,id){
  var tempId=id.replace("/","");
  tempId=tempId.replace("#","");
  $('#mess'+tempId).append($('<li>').html('<a href="public/images/'+fPath+'" target="_blank">Click here to download file</a> '));
});

//Sending message to other user
socket.on('chat file rec', function(name,fPath,id){
  var tempId=id.replace("/","");
  tempId=tempId.replace("#","");
  $('#mess'+tempId).append($('<li>').html('<a href="public/images/'+fPath+'" target="_blank">Click here to download file</a> '));
});
