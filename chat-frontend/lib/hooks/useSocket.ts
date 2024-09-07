import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket= (userId:string)=>{
    const [socket, setSocket]= useState<Socket |null>(null);
    const [onlineUsers, setOnlineUsers]= useState<Map<string, boolean>>(new Map());

    useEffect(()=>{
        const socketInstance= io('http://localhost:3001');
        setSocket(socketInstance);

        socketInstance.on('connect', ()=>{
            console.log('connected to socket Server');
            socketInstance.emit('userConnected', userId)
        });

        socketInstance.on('statusUpdate', ({userId, status})=>{
            console.log("in Status Upadte", userId, status)
            setOnlineUsers(prev => {
                const updated = new Map(prev);
                updated.set(userId, status === 'online');
                console.log("Updated onlineUsers map:", Array.from(updated.entries()));
                return updated;
            });
        });

        return ()=>{
            console.log('Disconnecting socket');
            socketInstance.disconnect()
        }
    }, [userId])
    // console.log(onlineUsers)
    return {socket, onlineUsers}
}
export default useSocket;