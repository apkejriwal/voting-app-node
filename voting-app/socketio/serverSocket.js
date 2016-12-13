var User = require('../app/models/user');

exports.init = function(io) {
    
    var clients = 0; 

    var yes = 0; 
    var no =  0; 

        io.on('connection', function(socket){

          // console.log('a user connected', "server.js");
          // ++clients; 
          // console.log('clients logged in', clients);
          // io.sockets.emit('users_count', clients);


          // socket.on('disconnect', function(){
          //   console.log('user disconnected');
          //   --clients;
          //   io.sockets.emit('users_count', clients);
          //   console.log(clients, 'num of clients after disconnect');
          // });

          socket.on('vote', function(vote) {
            if (vote === 'yes') {
              ++yes;
            }
            else {
              ++no;
            }
            console.log(yes, 'yes');
            console.log(no, 'no');
            console.log(vote);
          });

        });
}