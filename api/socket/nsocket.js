class FinalSocket {
  constructor(socket) {
    this.io = socket;
  }

  socketEvents() {
    console.log("************INSIDE SOCKET****************");

    var connectedUsers = [];
    this.io.on("connect", (socket) => {
      console.log(`#### user connect : ${socket.id}`);
      socket.on("chatID", (data) => {
        let chatID = data.id;
        console.log(`**************${chatID}`);
        socket.join(chatID);
        connectedUsers.push(chatID);

        console.log('connectedUsers>>>>>>>>>>>>>>>>',socket.adapter.rooms[chatID]
        )


        socket.emit("online_users", {
          users: connectedUsers,
        });
        socket.on("disconnect", () => {
          // remove connected users
          let index = connectedUsers.indexOf(chatID);
          if (index > -1) {
            connectedUsers.splice(index, 1);
          }

          // leave from room
          socket.leave(chatID);
          socket.emit("online_users", {
            users: connectedUsers,
          });
        });
        socket.on("send_message", (message) => {
          let receiverChatID = message.receiverID;
          let senderChatID = message.senderID;
          let content = message.content;

          let isReceiverAvailable = connectedUsers.includes(receiverChatID);
          console.log('socket room>>>>>>>>>>>>>>>>',socket.adapter.rooms[receiverChatID]);

          console.log(`*********check id for receiver ${isReceiverAvailable} and ${receiverChatID}`);
          // socket.in(receiverChatID).emit("receive_message", {
          this.io.in(receiverChatID).emit("receive_message", {
            'content': content,
            'senderChatID': senderChatID,
            'receiverChatID': receiverChatID,
          });
          console.log('send msg')
        });
      });
    });
  }
}

module.exports = FinalSocket;
