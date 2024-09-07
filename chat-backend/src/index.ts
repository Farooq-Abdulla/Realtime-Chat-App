import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const onlineUsers = new Map<string, string>();

io.on('connection', (socket) => {
    socket.on('userConnected', (userId) => {
        onlineUsers.set(userId, socket.id);
        // console.log(`Emitting statusUpdate for userId: ${userId}`);
        console.log(onlineUsers)
        io.emit('statusUpdate', { userId, status: 'online' });
    });
    socket.on('disconnect', () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`Disconnecting - Emitting statusUpdate for userId: ${userId}`);
                io.emit('statusUpdate', { userId, status: 'offline' });
                break;
            }
        }
    });
});

httpServer.listen(3001, () => {
    console.log('Server is listening on port 3001');
});
