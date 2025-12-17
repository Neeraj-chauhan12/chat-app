import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client";



const socketContext=createContext()

export const useSocketContext=()=>{
    return useContext(socketContext)
}

export const SocketProvider=({children})=>{

    const [socket,setSocket]=useState(null)
    const [onlineUsers,setOnlineUsers]=useState([])
    const user=localStorage.getItem('user')
    // console.log("Socket Context User:",user._id);
    useEffect(()=>{

        if(user){
            const socket=io('http://localhost:3000',{
                query:{userId:JSON.parse(user)._id}
            })
            setSocket(socket)
            socket.on('getOnlineUsers',(users)=>{
                setOnlineUsers(users)
            })

            return()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null)
            }
        }

    },[user])

    return(
        <socketContext.Provider value={{socket,onlineUsers}}>
            {children}
        </socketContext.Provider>
    )

}