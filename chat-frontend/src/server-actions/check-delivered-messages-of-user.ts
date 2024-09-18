'use server';

import prisma from "@/lib/prisma";

export default async function CheckDeliveredMsgsOfaUser(receiverId:string):Promise<Record<string,number>> {
    const unreadMsgs= await prisma.messages.findMany({
        where:{ 
            receiverId:receiverId,
            status: {not: "read"}
        }
    })
    let obj:Record<string, number>={}
    unreadMsgs.forEach((msg)=> {
        obj[msg.senderId]=(obj[msg.senderId]||0)+1
    })

    return obj
}