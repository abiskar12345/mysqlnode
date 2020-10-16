'use strict';

const path = require('path');
const helper = require('./qeryhandler');

class Socket{

    constructor(socket){
        this.io = socket;
    }
    
    socketEvents(){

        this.io.on('connect', (socket) => {

            console.log(`${socket.handshake.query.currentEmail} connect to socket => ${socket.id}`)
            /**
            * get the user's Chat list
            */
            socket.on('chat-list', async (userId) => {
                console.log(`this is user id :${userId}`)

               let chatListResponse = {};

                if (userId === '' && (typeof userId !== 'string' || typeof userId !== 'number')) {

                    chatListResponse.error = true;
                    chatListResponse.message = `User does not exits.`;
                    
                    this.io.emit('chat-list-response',chatListResponse);
                }else{
                    const result = await helper.getChatList(userId, socket.id);
                    this.io.to(socket.id).emit('chat-list-response', {
                        error: result !== null ? false : true,
                        singleUser: false,
                        chatList: result.chatlist
                    });

                    socket.broadcast.emit('chat-list-response', {
                        error: result !== null ? false : true,
                        singleUser: true,
                        chatList: result.userinfo
                    });
                }
            });
            /**
            * send the messages to the user
            */
            socket.on('send_message', async (data) => {
                
                if (data.message === '') {
                    
                    this.io.to(socket.id).emit(`send_message_response`,`Message cant be empty`); 

                }else if(data.fromUserId === ''){
                    
                    this.io.to(socket.id).emit(`send_message_response`,`Unexpected error, Login again.`); 

                }else if(data.toUserId === ''){
                    
                    this.io.to(socket.id).emit(`send_message_response`,`Select a user to chat.`); 

                }else{                    
                    let receiverEmail = data.receiver;
                    console.log(`msg response : >>>>>> ${receiverEmail}`);
                    const sqlResult = await helper.insertMessages({
                        senderEmail: data.sender,
                        receiverEmail: data.receiver,
                        message: data.message
                    });
                    if(sqlResult && sqlResult!=null){
                        next();
                    }else{
                        console.log("message insertion failed");
                    }
            
                    this.io.emit(`send_message_response`, data); 
                }               
            });


            /**
            * Logout the user
            */
            socket.on('logout', async () => {
                const isLoggedOut = await helper.logoutUser(socket.id);
                this.io.to(socket.id).emit('logout-response',{
                    error : false
                });
                socket.disconnect();
            });


            /**
            * sending the disconnected user to all socket users. 
            */
            socket.on('disconnect',async ()=>{
                const isLoggedOut = await helper.logoutUser(socket.id);
                setTimeout(async ()=>{
                    const isLoggedOut = await helper.isUserLoggedOut(socket.id);
                    if (isLoggedOut && isLoggedOut !== null) {
                        socket.broadcast.emit('chat-list-response', {
                            error: false,
                            userDisconnected: true,
                            socketId: socket.id
                        });
                    }
                },1000);
            });

        });

    }
    
    socketConfig(){
        this.io.use( async (socket, next) => {
            console.log("configuring")
            let userEmail = socket.handshake.query.currentEmail;
            console.log(`useremail is :${userEmail}`)
            let userSocketId = socket.id;          
            const response = await helper.addSocketId( userEmail, userSocketId);
            if(response &&  response !== null){
                next();
            }else{
                console.error(`Socket connection failed, for  user Id ${userId}.`);
            }
        });

        this.socketEvents();
    }
}
module.exports = Socket;