import {io} from 'socket.io-client'

let socket;
export const initializeSocket=(ProjectId)=>{
    socket=io('https://chat-application-backend-vert.vercel.app/',{
        auth:{
            token:localStorage.getItem('token')
        },
        query:{
            projectId:ProjectId
        },
        transports: ["websocket"]
    })
    return socket
}


export const receiveMessage = (eventName, cd) => {
    socket.on(eventName, cd);
}

export const sendMessage=(eventName,data)=>{
    socket.emit(eventName,data)
}