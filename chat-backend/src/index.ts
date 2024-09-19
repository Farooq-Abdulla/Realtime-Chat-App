import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors=require('cors')
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io: Server = new Server(httpServer, {
    cors: {
    origin: ["http://localhost:3000","https://realtime-chat.101xdev.com/" ],
        methods: ["GET", "POST"],
    }
});

type UserStatus = boolean;

interface IMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const onlineUsers: Map<string, UserStatus> = new Map();
const userSockets: Map<string, string> = new Map(); 

function emitOnlineUsers(): void {
    io.emit('onlineUsersUpdate', Array.from(onlineUsers.entries()));
}

io.on('connection', (socket: Socket) => {

    socket.on('userConnected', (userId: string) => {
        console.log(`User connected: ${userId}`);
        onlineUsers.set(userId, true);
        userSockets.set(userId, socket.id);
        emitOnlineUsers();
    });
    socket.on('userDisconnected', (userId: string) => {
        console.log(`User disconnected: ${userId}`);
        onlineUsers.delete(userId);
        userSockets.delete(userId);
        emitOnlineUsers();
    });

    socket.on("sent-msg", (response)=>{
        const {senderId, receiverId, content}=response
        const sendMsgTo=userSockets.get(receiverId)
        if(sendMsgTo){
            io.to(sendMsgTo).emit("received-msg", response)
        }
    })

    socket.on("read-msg", (response:IMessage[], id:string)=>{
        response.forEach((message)=> message.status="read")
        // console.log(id);
        const sendMsgTo=userSockets.get(id)
        if(sendMsgTo) io.to(sendMsgTo).emit("read-msg", response)
        // console.log("sending read response", response);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        let disconnectedUserId: string | undefined;
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }
        if (disconnectedUserId) {
            onlineUsers.delete(disconnectedUserId);
            userSockets.delete(disconnectedUserId);
            emitOnlineUsers();
        }
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});