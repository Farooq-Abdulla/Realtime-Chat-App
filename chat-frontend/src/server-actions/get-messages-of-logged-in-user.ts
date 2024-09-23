'use server'

import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { Messages } from "@prisma/client"

export interface IUserMessages{
    sentMessages:Messages[],
    receivedMessages:Messages[]
}
export default async function getMessagesofLoggedInUser(userId:string):Promise<Messages[]>{
    const messageIDS=await redis.smembers(`messages:${userId}`)
    const userMessages:Messages[] = await Promise.all(
        messageIDS.map(async (messageId) => {
          const msg= await redis.hgetall(`messages:${userId}:${messageId}`);
          return {
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            status: msg.status,
            createdAt: new Date(msg.createdAt),
            updatedAt: new Date(msg.updatedAt),
          };
        })
      );
      if(userMessages.length) return userMessages
    const user= await prisma.user.findUnique({
        where:{
            id:userId
        },
        include:{
            sentMessages:true,
            receivedMessages:true
        }
    })
    if(!user){
        return []
    }
    const combinedMessages:Messages[]=[...user.sentMessages, ...user.receivedMessages]
    // combinedMessages.forEach(async(msg)=> {
    //     await redis.hset(`messages:${userId}:${msg.id}`, msg)
    //     await redis.sadd(`messages:${userId}`, msg.id)
    // })
    return combinedMessages
}
