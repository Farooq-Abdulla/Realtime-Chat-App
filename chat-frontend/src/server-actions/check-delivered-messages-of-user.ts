'use server';

import prisma from "@/lib/prisma";

export default async function CheckDeliveredMsgsOfaUser(receiverId:string):Promise<Record<string,number>> {
    // console.log("the receivedId is ", receiverId)
    let obj:Record<string, number>={}
    if(!receiverId) return obj
    const unreadMsgs= await prisma.messages.findMany({
        where:{ 
            receiverId:receiverId,
            status: {not: "read"}
        }
    })

    unreadMsgs.forEach((msg)=> {
        obj[msg.senderId]=(obj[msg.senderId]||0)+1
    })

    return obj
}