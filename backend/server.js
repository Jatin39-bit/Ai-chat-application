import app from './app.js'
import http from 'http'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import mongoose from 'mongoose'
import projectModel from './models/project.model.js'
import { aiResponse } from './services/ai.service.js'


const Port=process.env.PORT || 3000
app.use(cors())

const server = http.createServer(app)
import {Server} from 'socket.io'
const io=new Server(server,{
  cors:{
    origin:['*'],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  },
  transports:["websocket", "polling"]
})

io.use(async(socket,next)=>{
  try{
    const token=socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]
    const projectId=socket.handshake.query.projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid project ID'));
    }

    
    
    if(!token){
      return next(new Error('Authentication error'))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    socket.user=decoded
    socket.project = await projectModel.findOne({ _id: projectId, users: socket.user.id });

    next()

  }catch(err){
    console.log(err)
    return next(new Error('Authentication error'))
  }
})

io.on('connection', socket => {
  console.log(`a user connected: ${socket.id}`);
  socket.roomId=socket.project._id.toString()

  socket.join(socket.roomId)


  socket.on('project-msg', data=>{
    socket.broadcast.to(socket.roomId).emit('project-msg',data)
    if(data.message.includes('@ai')){
      try{
        const prompt=data.message.replace('@ai','')
        aiResponse(prompt).then(response=>{
          io.to(socket.roomId).emit('project-msg',{message:response, sender:'AI'})
        })
      }catch(err){
        socket.emit('project-msg',{message:err.message, sender:'AI'})
      }
      return
    }
  })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { console.log(`user dissconnected ${socket.id}`)})
});

server.listen(Port, () => {
  console.log(`Server running on port ${Port}`)
})