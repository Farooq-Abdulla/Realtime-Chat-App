import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Redis } from "ioredis";
import { Server, Socket } from "socket.io";
dotenv.config();
const app = express();

const httpServer = createServer(app);
const io: Server = new Server(httpServer, {
    cors: {
        allowedHeaders:["*"],
        origin: "*",
    }
});

const serverId= crypto.randomUUID();
const pub= new Redis(process.env.REDIS_URL!)
const sub= new Redis(process.env.REDIS_URL!)
const redis= new Redis(process.env.REDIS_URL!)

sub.subscribe("ONLINE_USERS");
sub.subscribe("MESSAGE_TRANSFER")
sub.subscribe("READ_MESSAGE")
sub.subscribe("DISCONNECT")


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

// async function emitOnlineUsers(): Promise<void> {
//     io.emit('onlineUsersUpdate', Array.from(onlineUsers.entries()));
// }

io.on('connection', (socket: Socket) => {

    socket.on('userConnected', async(userId: string) => {
        console.log(`User connected: ${userId}`);
        // onlineUsers.set(userId, true);
        // userSockets.set(userId, socket.id);
        // emitOnlineUsers();
        await redis.hset(`serverSockets:${serverId}`,socket.id, userId)
        await redis.sadd('onlineUsers', userId)
        await redis.hset(`userSockets:${userId}`,'socketId',socket.id )
        const allusers= await redis.smembers("onlineUsers")
        await pub.publish("ONLINE_USERS", JSON.stringify(allusers))
    });
    socket.on('userDisconnected', async(userId: string) => {
        console.log(`User disconnected: ${userId}`);
        // onlineUsers.delete(userId);
        // userSockets.delete(userId);
        // emitOnlineUsers();
        await redis.hdel(`serverSockets:${serverId}`, socket.id)
        await redis.srem("onlineUsers", userId)
        await redis.del(`userSockets:${userId}`)
        const allusers= await redis.smembers("onlineUsers")
        await pub.publish("ONLINE_USERS", JSON.stringify(allusers))

        
    });

    socket.on("sent-msg", async(response)=>{
        const {senderId, receiverId, content}=response
        // const sendMsgTo=userSockets.get(receiverId)
        const sendMsgTo=await redis.hget(`userSockets:${receiverId}`, 'socketId')
        if(sendMsgTo){
            // io.to(sendMsgTo).emit("received-msg", response)
            await pub.publish(`MESSAGE_TRANSFER`, JSON.stringify({
                socketId:sendMsgTo,
                response:response
            }))
        }
    })

    socket.on("read-msg", async(response:IMessage[], id:string)=>{
        response.forEach((message)=> message.status="read")
        // console.log(id);
        // const sendMsgTo=userSockets.get(id)
        const sendMsgTo=await redis.hget(`userSockets:${id}`, 'socketId')
        // if(sendMsgTo) io.to(sendMsgTo).emit("read-msg", response)
        // console.log("sending read response", response);
        if(sendMsgTo){
            await pub.publish(`READ_MESSAGE`, JSON.stringify({
                socketId:sendMsgTo,
                response:response
            }))
        }
    })

    socket.on('disconnect', async() => {
        console.log('Client disconnected');
        // console.log(socket.id);
        await pub.publish("DISCONNECT", socket.id)
        setTimeout(async()=>{
            const allusers= await redis.smembers("onlineUsers")
            await pub.publish("ONLINE_USERS", JSON.stringify(allusers))
        },500)
        
        // let disconnectedUserId: string | undefined;
        // for (const [userId, socketId] of userSockets.entries()) {
        //     if (socketId === socket.id) {
        //         disconnectedUserId = userId;
        //         break;
        //     }
        // }
        // if (disconnectedUserId) {
        //     onlineUsers.delete(disconnectedUserId);
        //     userSockets.delete(disconnectedUserId);
        //     emitOnlineUsers();
        // }
    });
});

sub.on("message", async(channel, message)=>{
    if(channel==="ONLINE_USERS"){
        io.emit("onlineUsersUpdate", JSON.parse(message))
    }else if(channel==="MESSAGE_TRANSFER"){
        const {socketId, response}=JSON.parse(message);
        const exits=await redis.hexists(`serverSockets:${serverId}`, socketId)
        if(exits){
            io.to(socketId).emit("received-msg",response);
        }
    }else if(channel==="READ_MESSAGE"){
        const {socketId, response}=JSON.parse(message)
        const exits=await redis.hexists(`serverSockets:${serverId}`, socketId)
        if(exits){
            io.to(socketId).emit("read-msg", response)
        }
    }else if(channel==="DISCONNECT"){
        const exits=await redis.hexists(`serverSockets:${serverId}`, message)
        if(exits){
            const userId=await redis.hget(`serverSockets:${serverId}`, message);
            await redis.srem("onlineUsers",userId!)
            await redis.del(`userSockets:${userId}`)
            await redis.hdel(`serverSockets:${serverId}`, message)
        }
    }
})

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

process.on('exit', async() => {
    console.log('Server ended');
    await redis.del(`serverSockets:${serverId}`)
  });
  
  process.on('SIGINT', async() => {
    console.log('Server ended');
    await redis.del(`serverSockets:${serverId}`)
    process.exit();
  });
  
  process.on('SIGTERM', async() => {
    console.log('Server ended');
    await redis.del(`serverSockets:${serverId}`)
    process.exit();
  });
  
  process.on('uncaughtException', async(err) => {
    console.log('Uncaught exception: ', err);
    await redis.del(`serverSockets:${serverId}`)
    process.exit(1);
  });