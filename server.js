// const http = require('http');
// const app = require('./app');
// const socketio = require("socket.io");

// const socketEvents = require('./api/socket/socket'); 
 

// const port = process.env.PORT || 5000;

// const server = http.createServer(app);
// const socket =socketio(server);



//   new socketEvents(socket).socketConfig();
  
 


// server.listen(port);





const app = require("./app");
const http = require("http").Server(app);

const socket = require("socket.io")(http);

const socketEvents = require('./api/socket/socket'); 
 

const port = process.env.PORT || 5000;

// This map has all users connected
const userMap = new Map();

// const server = http.createServer(app);
console.log(`server this is : ${socket}`);
socket.on("connect", (socket) => {
  onEachUserConnection(socket);
  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
  });
});
http.listen(port);

function onEachUserConnection(socket) {
  console.log(
    "User connected" +
      socket.id +
      ", query" +
      JSON.stringify(socket.handshake.query)
  );

  const fromUserEmail = socket.handshake.query.from;
  console.log(`l******** ${fromUserEmail}`)
  let userMapVal = { socket_id: socket.id };
  addUserToMap(fromUserEmail, userMapVal);
  console.log(`socket id is: ${userMapVal.socket_id}`);
  printNumOfOnlineUsers();
  checkOnlineUser(socket);

  onMessage(socket);
}
// THIS IS FOR SINGLE CHAT OR PRIVATE CHAT
function onMessage(socket) {
  socket.on("single_chat_message", (chat_msg) => {
    singleChatHandler(socket, chat_msg);
  });
}
function singleChatHandler(socket, chat_message) {}

function addUserToMap(username, socketID) {
  userMap.set(username, socketID);
}

function printNumOfOnlineUsers() {
  console.log(`${userMap.size} users online`);
}

// ********* check user is online (start) ************

function checkOnlineUser(socket) {
  console.log("**********check user is online or not *****");
  socket.on("check_online", (user_data) => {
    console.log("Hey chekc");
    console.log(`hello dear: ${user_data.toUsername}`)
    handleCheckOnlineUser(socket, user_data);
  });
}
function handleCheckOnlineUser(socket, user_data) {
  console.log("******handle check online&*******");
  let toUserEmail = user_data.toUserEmail;
  console.log(`send to user email: ${toUserEmail}`);
  let toUserSocketID = getSocketIdFromMap(toUserEmail);

  let toUserOnline = userFoundOnMap(toUserEmail);

}

function getSocketIdFromMap(toUserEmail) {
  console.log("Geting socket id for touser " + toUserEmail);
  let userMapVal = userMap.get(toUserEmail);
  // console.log(`***${userMapVal.socket_id}**`);
  if (userMapVal == undefined) {
    return undefined;
  }
  return userMapVal.socket_id;
}

function userFoundOnMap(toUsername) {
  let toUserSocketID = getSocketIdFromMap(toUsername);
  return toUserSocketID != undefined;
}
// ********* check user is online (end) ************

module.exports = http;
