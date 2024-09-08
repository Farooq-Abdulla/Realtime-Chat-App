import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io: Server = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

type UserStatus = boolean;

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

httpServer.listen(3001, () => {
    console.log('Server is listening on port 3001');
});