import {io} from 'socket.io-client'

let socket;
export const initializeSocket=(ProjectId)=>{
    socket=io('http://localhost:3000',{
        auth:{
            token:localStorage.getItem('token')
        },
        query:{
            projectId:ProjectId
        }
    })
    return socket
}


export const receiveMessage = (eventName, cd) => {
    socket.on(eventName, cd);
}

export const sendMessage=(eventName,data)=>{
    socket.emit(eventName,data)
}