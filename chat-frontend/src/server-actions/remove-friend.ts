'use server'

import prisma from "@/lib/prisma"

export default async function RemoveFriend(userId: string, friendId: string) {
    await prisma.friend.delete({
        where: {
            user1Id_user2Id: {
                user1Id:userId,
                user2Id:friendId
            }
        },
    }).catch(async()=>{
        await prisma.friend.delete({
            where:{
                user1Id_user2Id:{
                    user1Id:friendId,
                    user2Id:userId
                }
            }
        })
    })
}
