'use server'

import { IPostMessageType } from "@/lib/hooks/useSendMessage"
import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { Messages } from "@prisma/client"

export default async function handleStoreMessages(message:IPostMessageType):Promise<Messages>{
    const {senderId, receiverId, content, online}= message
    const storedMessage= await prisma.messages.create({
        data:{
            senderId:senderId,
            receiverId:receiverId,
            content:content,
            status:online? 'delivered':'sent'
        }
    })
    await redis.sadd(`messages:${senderId}`, storedMessage.id);
    await redis.sadd(`messages:${receiverId}`, storedMessage.id);
    await redis.hset(`messages:${senderId}:${storedMessage.id}`, storedMessage)
    await redis.hset(`messages:${receiverId}:${storedMessage.id}`, storedMessage)
    return storedMessage

}