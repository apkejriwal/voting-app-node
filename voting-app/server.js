var express  = require('express');
var app      = express();
var http = require('http').Server(app);
var port     = process.env.PORT || 8080;
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var clients = 0; 

var yes = 0; 
var no =  0; 

io.on('connection', function(socket){
  console.log('a user connected', "server.js");
  ++clients; 
  console.log('clients logged in', clients);
  io.sockets.emit('users_count', clients);


  socket.on('disconnect', function(){
    console.log('user disconnected');
    --clients;
    io.sockets.emit('users_count', clients);
    console.log(clients, 'num of clients after disconnect');
  });

  socket.on('loginProfile', function(data) {
    console.log(data, "inside");
});

});

// socket.on('loginProfile', function(data) {
//   console.log(data, "outside");
// });


// launch ======================================================================
http.listen(port, function(){
  console.log('listening on *:8080');
});
console.log('The magic happens on port ' + port);