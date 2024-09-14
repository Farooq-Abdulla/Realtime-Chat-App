'use server'

import prisma from "@/lib/prisma"
import { Messages } from "@prisma/client"

export interface IUserMessages{
    sentMessages:Messages[],
    receivedMessages:Messages[]
}
export default async function getMessagesofLoggedInUser(userId:string):Promise<Messages[]>{
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
    return combinedMessages
}