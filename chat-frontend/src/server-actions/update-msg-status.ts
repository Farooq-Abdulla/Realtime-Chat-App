'use server';

import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";

export default async function UpdateMessageStatus(id:string, status:string) {
    const updatedMsg=await prisma.messages.update({
        where: {
            id:id
        },
        data:{
            status: status
        }
    })
    await redis.hset(`messages:${updatedMsg.senderId}:${id}`, 'status', 'read')
    await redis.hset(`messages:${updatedMsg.receiverId}:${id}`, 'status', 'read')
}