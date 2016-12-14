// server side for socket functionality 
// will redirect to rushee_list page 

exports.init = function(io) {

io.on('connection',function(socket){
  socket.on('login',function(test){
      console.log("login hit on server");
      var destination = '/rushee_list';
      io.sockets.emit('redirect', destination);
    });
});

}