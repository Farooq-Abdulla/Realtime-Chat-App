'use server'

import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { Messages } from "@prisma/client"

export interface IUserMessages{
    sentMessages:Messages[],
    receivedMessages:Messages[]
}
export default async function getMessagesofLoggedInUser(userId:string):Promise<Messages[]>{
    const cachedMessages=await redis.lrange(`messages:${userId}`,0,-1)
    if(cachedMessages.length){
        const cachedResponse:Messages[]= cachedMessages.map(msg=> JSON.parse(msg))
        return cachedResponse
    }
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
    //     await redis.lpush(`messages:${userId}`, JSON.stringify(msg))
    // })
    return combinedMessages
}