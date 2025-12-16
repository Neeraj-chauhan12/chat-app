import express from 'express'
import http from 'http'

import { Server } from 'socket.io'

const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})

const users={}

io.on('connection',(socket)=>{
    console.log('a user connected:',socket.id)
    const userId=socket.handshake.query.userId;
    if(userId){
    users[userId]=socket.id
    console.log('Online Users:',users)
    }

    // Emit the updated list of online users to all connected clients
    io.emit('getOnlineUsers',Object.keys(users))

    socket.on('disconnect',()=>{
        console.log('user disconnected:',socket.id)
        delete users[userId]
        io.emit('getOnlineUsers',Object.keys(users))
    })
})

export {app,server,io}