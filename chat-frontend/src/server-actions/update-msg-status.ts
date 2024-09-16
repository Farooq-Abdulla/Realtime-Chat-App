'use server';

import prisma from "@/lib/prisma";

export default async function UpdateMessageStatus(id:string, status:string) {
    await prisma.messages.update({
        where: {
            id:id
        },
        data:{
            status: status
        }
    })
}