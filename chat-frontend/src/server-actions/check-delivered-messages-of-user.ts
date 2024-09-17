'use server';

import prisma from "@/lib/prisma";

export default async function CheckDeliveredMsgsOfaUser(senderId:string, receiverId:string) {
    const unreadMsgs= await prisma.messages.count({
        where:{ 
            senderId:senderId,
            receiverId:receiverId,
            status: {not: "read"}
        }
    })
    console.log(unreadMsgs)
    return unreadMsgs
}