const { Server } = require('socket.io');
const http = require('http');

const express = require('express');
const app = express();
const server=http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'],
    }
});

function getRecieverSocketId(userId){
    return userSocketMap[userId]
}
const userSocketMap={}           //used to store online users, syntax is as follows:{userId:socketId}
io.on('connection', (socket) => {
    console.log('A user is connected',socket.id);  // the syntax is as follows: in function name: if "socket" is there it means it is being sent to one only whereas if "io" is there it means it is being sent to all 
                                                   // if "*on()" means means it is being listened whreas if "*emit()" means it is being sent

    const userId=socket.handshake.query.userId
    if(userId){
        userSocketMap[userId]=socket.id
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        console.log('user is disconnected',socket.id);
        delete userSocketMap[userId]
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    });
})

module.exports={io,app,server,getRecieverSocketId}