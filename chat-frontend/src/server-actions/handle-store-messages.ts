'use server'

import { IPostMessageType } from "@/lib/hooks/useSendMessage"
import prisma from "@/lib/prisma"
import { Messages } from "@prisma/client"

export default async function handleStoreMessages(message:IPostMessageType):Promise<Messages>{
    const {senderId, receiverId, content}= message
    return await prisma.messages.create({
        data:{
            senderId:senderId,
            receiverId:receiverId,
            content:content
        }
    })

}