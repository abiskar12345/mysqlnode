const http = require('http');
const app = require('./app');
const socketio = require("socket.io");

const socketEvents = require('./api/socket/socket'); 
 

const port = process.env.PORT || 5000;

const server = http.createServer(app);
const socket =socketio(server);



  new socketEvents(socket).socketConfig();
  
 


server.listen(port);


