const http = require('http');
const app = require('./app');
const socketio = require("socket.io");

// const socketEvents = require('./api/socket/socket');
const finalSocketEvents = require('./api/socket/nsocket')

const port = process.env.PORT || 5000;

const server = http.createServer(app);
const socket =socketio(server);

  // new socketEvents(socket).socketConfig();
  new finalSocketEvents(socket).socketEvents();

server.listen(port,()=>{
  console.log("server listen at port",port)
});

module.exports = server;






























// http.listen(port);


// const app = require("./app");
// const http = require("http").Server(app);

// const io = require("socket.io")(http);

// const socketEvents = require("./api/socket/socket");
// const { stringify } = require("querystring");

// const port = process.env.PORT || 5000;

// // This map has all users connected
// const userMap = new Map();

// // const server = http.createServer(app);
// // console.log(`server this is : ${io}`);
// // io.sockets.on("connect", (socket) => {
// //   onEachUserConnection(socket);
// //   socket.on("event", (data) => {
// //     /* … */
// //   });
// //   socket.on("disconnect", () => {
// //     /* … */
// //   });
// // });
// var users = [];
// io.on("connect", function (socket) {
//   console.log("user connected", socket.id);
//   socket.on("user_connected", (loggedInEmail) => {
//     // save in array
//     users[loggedInEmail] = socket.id;
//     // console.log(
//     //   `${loggedInEmail} connected => socket id: ${users[loggedInEmail]}`
//     // );

//     // socket id will be used to send private message

//     // notify to all connected clients
//     io.emit("user_connected_response", loggedInEmail);
//   });

//   socket.on('send_message',data=>{
//     var socketId = users[data.receiver];

//     // var myRoom = 'room'+socketId;
//     var myRoom = data.receiver;
//     socket.join(myRoom);
//     console.log(`receiver ${data.receiver}=>${myRoom}`)
//     io.in(myRoom).emit('send_message_response',data);
//     // send to client
//     // io.emit('send_message_response',data);
//   })
// });


// LATER************************
// function onEachUserConnection(socket) {
//   console.log(
//     "User connected" +
//       socket.id +
//       ", query" +
//       JSON.stringify(socket.handshake.query)
//   );

//   const fromUserEmail = socket.handshake.query.from;
//   console.log(`l******** ${fromUserEmail}`);
//   let userMapVal = { socket_id: socket.id };
//   addUserToMap(fromUserEmail, userMapVal);
//   console.log(`socket id is: ${userMapVal.socket_id}`);
//   printNumOfOnlineUsers();
//   checkOnlineUser(socket);

//   onMessage(socket);
// }
// // THIS IS FOR SINGLE CHAT OR PRIVATE CHAT
// function onMessage(socket) {
//   socket.on("single_chat_message", (chat_msg) => {
//     console.log("hello send me msg");
//     singleChatHandler(socket, chat_msg);
//   });
// }
// function singleChatHandler(socket, chat_message) {
//   console.log(`message is : ${chat_message}`);
//   let toUserEmail = chat_message.toUserEmail;
//   let fromUserEmail = chat_message.fromUserEmail;
//   console.log(`from ${fromUserEmail} => ${toUserEmail}`);

//   let toUserSocketID = getSocketIdFromMap(toUserEmail);
//   let toUserOnline = userFoundOnMap(toUserEmail);

//   console.log(`socket id for ${toUserEmail}: ${toUserSocketID} => ${toUserOnline}`);

//   // if(!toUserOnline){
//   //   console.log("user is not connected");
//   //   // TODO MORE
//   //   return;
//   // }

//   chat_message.toUserOnlineStatus = true;
//   // sendToConnectedSocket(socket,toUserEmail,"receive_message",chat_message);

//   socket.emit('receive_message',chat_message)
// }

// function addUserToMap(username, socketID) {
//   userMap.set(username, socketID);
// }

// function printNumOfOnlineUsers() {
//   console.log(`${userMap.size} users online`);
// }

// // ********* check user is online (start) ************

// function checkOnlineUser(socket) {
//   console.log("**********check user is online or not *****");
//   socket.on("check_online", (user_data) => {
//     console.log("Hey chekc");
//     console.log(`hello dear: ${user_data.toUsername}`);
//     handleCheckOnlineUser(socket, user_data);
//   });
// }
// function handleCheckOnlineUser(socket, user_data) {
//   console.log("******handle check online&*******");
//   let toUserEmail = user_data.toUserEmail;
//   console.log(`send to user email: ${toUserEmail}`);
//   let toUserSocketID = getSocketIdFromMap(toUserEmail);
//   console.log(`i m going to send to ${toUserSocketID}`);

//   let toUserOnline = userFoundOnMap(toUserEmail);
//   user_data.toUserOnlineStatus = toUserOnline ? true : false;
//   sendBackToClient(socket, "is_user_connected", user_data);

//   console.log(`&&&&&&&&&&&&&&&${toUserOnline}`);
// }

// function getSocketIdFromMap(toUserEmail) {
//   console.log("Geting socket id for touser " + toUserEmail);
//   let userMapVal = userMap.get(toUserEmail);
//   // console.log(`***${userMapVal.socket_id}**`);
//   if (userMapVal == undefined) {
//     return undefined;
//   }
//   return userMapVal.socket_id;
// }

// function userFoundOnMap(toUsername) {
//   let toUserSocketID = getSocketIdFromMap(toUsername);
//   console.log(`%%%%%%%${toUserSocketID}`);
//   return toUserSocketID != undefined;
// }
// // ********* check user is online (end) ************

// // SEND TO CLIENT
// function sendBackToClient(socket, target_event, message) {
//   socket.emit(target_event, JSON.stringify(message));
// }

// function sendToConnectedSocket(socket,toUserEmail,target_event,message){
//   console.log(`to user: ${toUserEmail}`)
//   // socket.to(toUserSocketID).emit(target_event,message)
//   socket.broadcast.emit(target_event,JSON.stringify(message));
//   console.log("sent message")
//   // socket.connected[toUserSocketID].emit(target_event,message);
// }

// module.exports = http;
